import { pool } from "../utils/db";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) || {};
  const uppercase = (value: unknown) =>
    String(value ?? "")
      .trim()
      .toUpperCase();

  const firstname = uppercase(body.firstname);
  const middlename = uppercase(body.middlename);
  const lastname = uppercase(body.lastname);
  const studid = uppercase(body.studid);
  const contactName = uppercase(body.contact_name);
  const contactNumber = uppercase(body.contact_number);
  const contactAddress = uppercase(body.contact_address);
  const course = String(body.course ?? "").trim();

  if (!firstname || !lastname || !studid || !course) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "First name, last name, student ID, and course are required.",
    });
  }

  const middleInitial = middlename ? `${Array.from(middlename)[0]}.` : "";
  const fullname = [firstname, middleInitial, lastname]
    .filter(Boolean)
    .join(" ");

  try {
    await pool.query(
      `INSERT INTO public.id_applications
       (studid, course, contact_name, contact_number, contact_address, fullname)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [studid, course, contactName, contactNumber, contactAddress, fullname],
    );

    return { status: "submitted" };
  } catch (error) {
    console.error("Failed to submit ID application:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Unable to submit the ID application.",
    });
  }
});
