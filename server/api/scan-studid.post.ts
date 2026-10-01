import { enrolmentPool, formatFullname } from "../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { studid } = body;

  if (!studid) {
    return { status: "not_found" };
  }

  // Fetch record from enrolment DB
  const result = await enrolmentPool.query(
    `SELECT studid, lastname, firstname, middlename, extname, is_active, picture, ldapuser, email, id_status 
     FROM public.student 
     WHERE studid = $1 
     LIMIT 1`,
    [studid],
  );

  if (result.rows.length > 0) {
    const rawStudent = result.rows[0];
    const fullname = formatFullname(rawStudent);

    return {
      status: "found",
      student: {
        studid: rawStudent.studid,
        firstname: rawStudent.firstname,
        middlename: rawStudent.middlename,
        lastname: rawStudent.lastname,
        extname: rawStudent.extname,
        fullname,
      },
    };
  }

  return { status: "not_found" };
});
