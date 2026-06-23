import TryCatch from "../middleware/TryCatch.js";
import ErrorHandler from "../utils/ErrorHandle.js";
import { sql } from "../utils/db.js";
import GetBufferFromFile from "../utils/Buffer.js";
import axios from "axios";
import dotenv from 'dotenv';
import ApplicationUpdateTemplate from "../utils/Template.js";
// import { SendMessage } from "../kafka/producer.js";
import nodemailer from 'nodemailer';
dotenv.config();
export const CreateCompany = TryCatch(async (req, res, next) => {
    const user = req.user;
    console.log("User:", user);
    if (!user) {
        throw new ErrorHandler("User not LoggedIn", 404);
    }
    if (user.role !== 'recruiter') {
        throw new ErrorHandler("Your are not Authorised to Create Company", 404);
    }
    console.log("CONTENT TYPE", req.headers["content-type"]);
    console.log("BODY", req.body);
    console.log("FILE", req.file);
    const { name, description, website } = req.body;
    if (!name || !description || !website) {
        throw new ErrorHandler("All Fields are Required", 404);
    }
    console.log("body:", req.body);
    const exsistingCompany = await sql `SELECT company_id from Companies where name= ${name}`;
    if (exsistingCompany.length !== 0) {
        return res.status(400).json({
            success: false,
            message: `Comapny with ${name} already exsist`
        });
    }
    const file = req.file;
    if (!file) {
        throw new ErrorHandler("File not Exsist", 404);
    }
    const buffer = await GetBufferFromFile(file);
    if (!buffer || !buffer.content) {
        throw new ErrorHandler("Failed To Create File Buffer", 404);
    }
    const { data } = await axios.post(process.env.UPLOAD_SERVICE + '/api/v1/utils/upload', {
        buffer: buffer.content,
    });
    const [newCompany] = await sql `INSERT into Companies(name,description,website,logo,logo_public_id,recruiter_id) values(${name},${description},${website},
    ${data.url},${data.public_id},${req.user?.id}) returning *`;
    return res.status(200).json({
        success: true,
        message: 'Company Created Successfully',
        comapny: newCompany
    });
});
export const DeleteCompany = TryCatch(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler("Your are not Logged In", 404);
    }
    if (user.role !== "recruiter") {
        throw new ErrorHandler("You are not authorised to create jobs", 403);
    }
    const { companyId } = req.params;
    const [company] = await sql `select logo_public_id from Companies where company_id=${companyId} and recruiter_id=${user?.id}`;
    if (!company) {
        throw new ErrorHandler("Company NotFound or You are not Authorised to Delete Company", 404);
    }
    await sql `Delete from Companies where company_id=${companyId}`;
    return res.status(200).json({
        success: true,
        message: "Company and All Associated Jobs Has been Deleted"
    });
});
export const CreateJob = TryCatch(async (req, res, next) => {
    const user = req.user;
    console.log("user2", user);
    if (!user) {
        throw new ErrorHandler("You are not Logged In", 401);
    }
    if (user.role !== "recruiter") {
        throw new ErrorHandler("You are not authorised to create jobs", 403);
    }
    const { title, description, role, salary, location, job_type, work_location, openings, company_id, } = req.body;
    // Validation
    if (!title ||
        !description ||
        !role ||
        !salary ||
        !location ||
        !job_type ||
        !work_location ||
        !company_id) {
        throw new ErrorHandler("All required fields are missing", 400);
    }
    // Verify company belongs to recruiter
    const [company] = await sql `
      SELECT company_id
      FROM Companies
      WHERE company_id=${company_id}
      AND recruiter_id=${user.id}
    `;
    if (!company) {
        throw new ErrorHandler("Company not found or you are not authorised", 404);
    }
    // Create Job
    const [job] = await sql `
      INSERT INTO Jobs
      (
        title,
        description,
        role,
        salary,
        location,
        job_type,
        work_location,
        openings,
        company_id,
        postedBy_Recruiter_id
      )
      VALUES
      (
        ${title},
        ${description},
        ${role},
        ${salary},
        ${location},
        ${job_type},
        ${work_location},
        ${openings || 1},
        ${company_id},
        ${user.id}
      )
      RETURNING *;
    `;
    return res.status(201).json({
        success: true,
        message: "Job created successfully",
        job,
    });
});
// Update Job Controller
export const UpdateJob = TryCatch(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler("You are not Logged In", 401);
    }
    if (user.role !== "recruiter") {
        throw new ErrorHandler("You are not authorised to update jobs", 403);
    }
    const jobId = Number(req.params.jobId);
    if (isNaN(jobId)) {
        throw new ErrorHandler("Invalid Job Id", 400);
    }
    const { title, description, role, salary, location, job_type, work_location, openings, isActive, } = req.body || {};
    // Verify job belongs to recruiter
    const [job] = await sql `
      SELECT *
      FROM Jobs
      WHERE job_id=${jobId}
      AND postedBy_Recruiter_id=${user.id}
    `;
    if (!job) {
        throw new ErrorHandler("Job not found or you are not authorised", 404);
    }
    // Update only supplied fields
    const [updatedJob] = await sql `
      UPDATE Jobs
      SET
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        role = COALESCE(${role}, role),
        salary=COALESCE(${salary},salary),
        location = COALESCE(${location}, location),
        job_type = COALESCE(${job_type}, job_type),
        work_location = COALESCE(${work_location}, work_location),
        openings = COALESCE(${openings}, openings),
        isActive = COALESCE(${isActive}, isActive),
        updated_at = CURRENT_TIMESTAMP
      WHERE job_id=${jobId}
      RETURNING *;
    `;
    return res.status(200).json({
        success: true,
        message: "Job updated successfully",
        job: updatedJob,
    });
});
// Get All Company
export const GetAllCompanies = TryCatch(async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;
    let companies;
    let total;
    if (search) {
        companies = await sql `
        SELECT *
        FROM Companies
        WHERE name ILIKE ${`%${search}%`}
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
        const countResult = await sql `
        SELECT COUNT(*) AS total
        FROM Companies
        WHERE name ILIKE ${`%${search}%`}
      `;
        total = Number(countResult[0].total);
    }
    else {
        companies = await sql `
        SELECT *
        FROM Companies
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
        const countResult = await sql `
        SELECT COUNT(*) AS total
        FROM Companies
      `;
        total = Number(countResult[0].total);
    }
    return res.status(200).json({
        success: true,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        companies,
    });
});
// Get Company Detail ById
export const GetCompanyById = TryCatch(async (req, res, next) => {
    const companyId = Number(req.params.companyId);
    if (isNaN(companyId)) {
        throw new ErrorHandler("Invalid Company Id", 400);
    }
    // Get Company
    const [company] = await sql `
      SELECT *
      FROM Companies
      WHERE company_id = ${companyId}
    `;
    if (!company) {
        throw new ErrorHandler("Company Not Found", 404);
    }
    // Get Associated Jobs
    const jobs = await sql `
      SELECT
        job_id,
        title,
        description,
        role,
        location,
        job_type,
        work_location,
        openings,
        isActive,
        created_at
      FROM Jobs
      WHERE company_id = ${companyId}
      ORDER BY created_at DESC
    `;
    return res.status(200).json({
        success: true,
        company,
        totalJobs: jobs.length,
        jobs,
    });
});
// Get All Active Jobs
export const GetAllActiveJobs = TryCatch(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    // ✅ FIX 1: Use null instead of "" to prevent PostgreSQL enum errors
    const search = req.query.search?.toString().trim() || null;
    const location = req.query.location?.toString().trim() || null;
    const jobType = req.query.jobType?.toString().trim() || null;
    const workLocation = req.query.workLocation?.toString().trim() || null;
    const companyId = Number(req.query.companyId) || null;
    const sort = req.query.sort || "latest";
    let orderBy = sql `j.created_at DESC`;
    if (sort === "oldest") {
        orderBy = sql `j.created_at ASC`;
    }
    // ✅ FIX 2: Compare against null instead of ""
    const jobs = await sql `
    SELECT
      j.job_id,
      j.title,
      j.description,
      j.role,
      j.location,
      j.job_type,
      j.work_location,
      j.openings,
      j.isActive,
      j.created_at,

      c.company_id,
      c.name AS company_name,
      c.logo AS company_logo,
      c.website

    FROM Jobs j
    JOIN Companies c
      ON j.company_id = c.company_id

    WHERE
      j.isActive = true

      AND (
        ${search === null}
        OR
        j.title ILIKE ${`%${search}%`}
        OR
        j.role ILIKE ${`%${search}%`}
      )

      AND (
        ${location === null}
        OR
        j.location ILIKE ${`%${location}%`}
      )

      AND (
        ${jobType === null}
        OR
        j.job_type = ${jobType}
      )

      AND (
        ${workLocation === null}
        OR
        j.work_location = ${workLocation}
      )

      AND (
        ${companyId === null}
        OR
        j.company_id = ${companyId}
      )

    ORDER BY ${orderBy}
    LIMIT ${limit}
    OFFSET ${offset}
  `;
    const [count] = await sql `
    SELECT
      COUNT(*)::INTEGER AS total
    FROM Jobs j
    WHERE
      j.isActive = true

      AND (
        ${search === null}
        OR
        j.title ILIKE ${`%${search}%`}
        OR
        j.role ILIKE ${`%${search}%`}
      )

      AND (
        ${location === null}
        OR
        j.location ILIKE ${`%${location}%`}
      )

      AND (
        ${jobType === null}
        OR
        j.job_type = ${jobType}
      )

      AND (
        ${workLocation === null}
        OR
        j.work_location = ${workLocation}
      )

      AND (
        ${companyId === null}
        OR
        j.company_id = ${companyId}
      )
  `;
    return res.status(200).json({
        success: true,
        totalJobs: count.total,
        currentPage: page,
        totalPages: Math.ceil(count.total / limit),
        jobs,
    });
});
/// Get Job By ID
export const GetJobById = TryCatch(async (req, res) => {
    const jobId = Number(req.params.jobId);
    if (isNaN(jobId)) {
        throw new ErrorHandler("Invalid Job Id", 400);
    }
    const [job] = await sql `
    SELECT
      j.job_id,
      j.title,
      j.description,
      j.role,
      j.salary,
      j.location,
      j.job_type,
      j.work_location,
      j.openings,
      j.isActive,
      j.created_at,
      j.updated_at,

      c.company_id,
      c.name AS company_name,
      c.description AS company_description,
      c.website AS company_website,
      c.logo AS company_logo,
      c.recruiter_id,

      COUNT(a.application_id)::INTEGER AS total_applications

    FROM Jobs j
    JOIN Companies c
      ON j.company_id = c.company_id

    LEFT JOIN Applications a
      ON j.job_id = a.job_id

    WHERE
      j.job_id = ${jobId}
      AND j.isActive = true

    GROUP BY
      j.job_id,
      c.company_id
  `;
    if (!job) {
        throw new ErrorHandler("Job Not Found", 404);
    }
    return res.status(200).json({
        success: true,
        job,
    });
});
// ApplyforJob   
export const ApplyForJob = TryCatch(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler("Please login first", 401);
    }
    if (user.role !== "job_seeker") {
        throw new ErrorHandler("Only candidates can apply for jobs", 403);
    }
    const { jobId } = req.body;
    // Check Job
    const [job] = await sql `
      SELECT *
      FROM Jobs
      WHERE job_id=${jobId}
      AND isActive=true
    `;
    if (!job) {
        throw new ErrorHandler("Job not found or is no longer active", 404);
    }
    // Prevent duplicate application
    const [existingApplication] = await sql `
      SELECT application_id
      FROM Applications
      WHERE applicant_id=${user.id}
      AND job_id=${jobId}
    `;
    if (existingApplication) {
        throw new ErrorHandler("You have already applied for this job", 400);
    }
    // Resume Check
    if (!user.resume) {
        throw new ErrorHandler("Please upload your resume before applying", 400);
    }
    // Create Application
    const [application] = await sql `
INSERT INTO Applications (
  applicant_id,
  job_id,
  resume_url,
  status
)
VALUES (
  ${user.id},
  ${jobId},
  ${user.resume},
  'Submitted'
)
RETURNING *;
`;
    return res.status(201).json({
        success: true,
        message: "Job application submitted successfully",
        application,
    });
});
// Get All Application (My)
export const GetAllApplications = TryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler("Please login first", 401);
    }
    console.log("user:", user);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const applications = await sql `
      SELECT
        a.application_id,
        a.status,
        a.applied_at,
        a.updated_at,

        j.job_id,
        j.title,
        j.role,
        j.location,
        j.job_type,
        j.work_location,

        c.company_id,
        c.name AS company_name,
        c.logo AS company_logo

      FROM Applications a

      JOIN Jobs j
        ON a.job_id = j.job_id

      JOIN Companies c
        ON j.company_id = c.company_id

      WHERE a.applicant_id = ${user.id}

      ORDER BY a.applied_at DESC

      LIMIT ${limit}
      OFFSET ${offset};
    `;
    const [count] = await sql `
      SELECT COUNT(*)::INTEGER AS total
      FROM Applications
      WHERE applicant_id = ${user.id};
    `;
    return res.status(200).json({
        success: true,
        totalApplications: count.total,
        currentPage: page,
        totalPages: Math.ceil(count.total / limit),
        applications,
    });
});
// Get AllApplication By Job Recruiter API
export const GetApplicationsByJob = TryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler("Please login first", 401);
    }
    if (user.role !== "recruiter") {
        throw new ErrorHandler("Unauthorized", 403);
    }
    const jobId = Number(req.params.jobId);
    const applications = await sql `
      SELECT
        a.*,
        j.title
      FROM Applications a
      JOIN Jobs j
        ON a.job_id = j.job_id
      WHERE
        a.job_id = ${jobId}
        AND j.postedBy_Recruiter_id = ${user.id}
      ORDER BY a.applied_at DESC;
    `;
    return res.status(200).json({
        success: true,
        totalApplications: applications.length,
        applications,
    });
});
// Update Application
export const UpdateApplication = TryCatch(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler("User not LoggedIn", 404);
    }
    if (user.role !== "recruiter") {
        throw new ErrorHandler("You are Not Authorised To Update Application", 404);
    }
    const { id } = req.params;
    const [application] = await sql `SELECT * from Applications where application_id=${id}`;
    if (!application) {
        throw new ErrorHandler("Application not Founds", 404);
    }
    const [job] = await sql `SELECT postedby_recruiter_id,title from Jobs where job_id=${application.job_id}`;
    // console.log(job);
    // console.log("PostedByRecruiterId", job.postedby_recruiter_id)
    // console.log("userId", user.id)
    if (job.postedby_recruiter_id !== user.id) {
        throw new ErrorHandler("Forbidden You are not Allowed", 404);
    }
    const { status } = req.body;
    const [updatedApplication] = await sql `UPDATE Applications SET status=${status} where application_id=${id} RETURNING *`;
    const [Applicant] = await sql `SELECT * from users where id=${updatedApplication.applicant_id}`;
    const message = {
        to: Applicant.email,
        subject: "Application Update - QuickJob",
        html: ApplicationUpdateTemplate(job.title, "Hired")
    };
    // SendMessage('send-mail', message).then(() => {
    //     console.log("Message Send To Kafka Queue");
    // }).catch((err) => {
    //     console.log(err);
    // })
    // For Deployment we are sending mail without Kafka
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.GMAIL_PASSWORD
        }
    });
    await transporter.sendMail({
        from: 'chetan.sharma200104022@gmail.com',
        to: message.to,
        subject: message.subject,
        html: message.html
    });
    console.log("Mail Sent to ", message.to);
    return res.status(200).json({
        message: "Application Updated",
        job: job,
        Application: updatedApplication
    });
});
