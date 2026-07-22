// server/api/export-applications.get.ts
import { pool } from "../utils/db";

export default defineEventHandler(async (event) => {
  const queryParams = getQuery(event);
  const startDate = queryParams.startDate as string;
  const endDate = queryParams.endDate as string;

  if (!startDate || !endDate) {
    throw createError({
      statusCode: 400,
      statusMessage: "Start date and end date are required.",
    });
  }

  try {
    // UPPER converts full_name, contact_name, and contact_address to ALL CAPS
    const query = `
      SELECT 
        id, 
        UPPER(
          TRIM(
            CONCAT_WS(' ', 
              TRIM(firstname), 
              CASE 
                WHEN middlename IS NOT NULL AND TRIM(middlename) <> '' 
                THEN LEFT(TRIM(middlename), 1) || '.' 
                ELSE NULL 
              END, 
              TRIM(lastname)
            )
          )
        ) AS full_name, 
        studid, 
        course, 
        UPPER(TRIM(contact_name)) AS contact_name, 
        contact_number, 
        UPPER(TRIM(contact_address)) AS contact_address, 
        id_picture_filename,
        created_at
      FROM id_applications
      WHERE created_at >= $1 AND created_at <= $2
      ORDER BY created_at DESC;
    `;

    const formattedEndDate = `${endDate}T23:59:59`;
    const result = await pool.query(query, [startDate, formattedEndDate]);

    // Helper function to safely escape CSV cell values
    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    // CSV Headers
    const headers = [
      "ID",
      "Full Name",
      "Student ID",
      "Course",
      "Contact Name",
      "Contact Number",
      "Contact Address",
      "ID Picture Filename",
      "Date Created",
    ];

    const rows = result.rows.map((row) => [
      escapeCsv(row.id),
      escapeCsv(row.full_name),
      escapeCsv(row.studid),
      escapeCsv(row.course),
      escapeCsv(row.contact_name),
      escapeCsv(row.contact_number),
      escapeCsv(row.contact_address),
      escapeCsv(row.id_picture_filename),
      escapeCsv(
        row.created_at ? new Date(row.created_at).toLocaleString() : "",
      ),
    ]);

    // Prepend UTF-8 BOM (\uFEFF) for Excel compatibility
    const csvContent =
      "\uFEFF" +
      [headers.map(escapeCsv).join(","), ...rows.map((r) => r.join(","))].join(
        "\n",
      );

    // Set Response Headers for CSV download
    setResponseHeaders(event, {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ID_Applications_${startDate}_to_${endDate}.csv"`,
      "Cache-Control": "no-cache",
    });

    return csvContent;
  } catch (error: any) {
    console.error("CSV Export Backend Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to generate CSV export",
    });
  }
});
