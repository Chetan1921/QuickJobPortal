import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const DB_URL = process.env.DB_URL || "";
export let sql: NeonQueryFunction<false, false>;

export const ConnectDB = async () => {
  try {
    sql = neon(DB_URL);

    console.log("Connected to the database successfully!");

    // =======================
    // Create ENUM Types
    // =======================
    await sql`
      DO $$
      BEGIN

        IF NOT EXISTS (
          SELECT 1
          FROM pg_type
          WHERE typname = 'job_type'
        ) THEN
          CREATE TYPE job_type AS ENUM (
            'Full-time',
            'Part-time',
            'Contract',
            'Internship'
          );
        END IF;

        IF NOT EXISTS (
          SELECT 1
          FROM pg_type
          WHERE typname = 'work_location'
        ) THEN
          CREATE TYPE work_location AS ENUM (
            'OnSite',
            'Remote',
            'Hybrid'
          );
        END IF;

        IF NOT EXISTS (
          SELECT 1
          FROM pg_type
          WHERE typname = 'application_status'
        ) THEN
          CREATE TYPE application_status AS ENUM (
            'Submitted',
            'Rejected',
            'Hired'
          );
        END IF;

      END
      $$;
    `;

    // =======================
    // Companies Table
    // =======================
    await sql`
      CREATE TABLE IF NOT EXISTS Companies (
        company_id SERIAL PRIMARY KEY,

        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        website VARCHAR(255),

        logo VARCHAR(255),
        logo_public_id VARCHAR(255),

        recruiter_id INTEGER NOT NULL
          REFERENCES users(id)
          ON DELETE CASCADE,

        created_at TIMESTAMPTZ NOT NULL
          DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMPTZ
          DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // =======================
    // Jobs Table
    // =======================
    await sql`
      CREATE TABLE IF NOT EXISTS Jobs (
        job_id SERIAL PRIMARY KEY,

        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        role VARCHAR(255) NOT NULL,
        salary VARCHAR(255) NOT NULL,

        location VARCHAR(255) NOT NULL,

        job_type job_type NOT NULL,
        work_location work_location NOT NULL,

        openings INTEGER DEFAULT 1,

        company_id INTEGER NOT NULL
          REFERENCES Companies(company_id)
          ON DELETE CASCADE,

        postedBy_Recruiter_id INTEGER NOT NULL
          REFERENCES users(id)
          ON DELETE CASCADE,

        isActive BOOLEAN DEFAULT TRUE,

        created_at TIMESTAMPTZ NOT NULL
          DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMPTZ
          DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // =======================
    // Applications Table
    // =======================
    await sql`
      CREATE TABLE IF NOT EXISTS Applications (
        application_id SERIAL PRIMARY KEY,

        applicant_id INTEGER NOT NULL
          REFERENCES users(id)
          ON DELETE CASCADE,

        job_id INTEGER NOT NULL
          REFERENCES Jobs(job_id)
          ON DELETE CASCADE,

        resume_url VARCHAR(500),

        status application_status NOT NULL
          DEFAULT 'Submitted',

        applied_at TIMESTAMPTZ NOT NULL
          DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMPTZ
          DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT unique_job_application
          UNIQUE (applicant_id, job_id)
      );
    `;

    // =======================
    // Indexes
    // =======================
    await sql`
      CREATE INDEX IF NOT EXISTS idx_company_recruiter
      ON Companies(recruiter_id);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_job_company
      ON Jobs(company_id);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_job_recruiter
      ON Jobs(postedBy_Recruiter_id);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_application_user
      ON Applications(applicant_id);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_application_job
      ON Applications(job_id);
    `;

    console.log("Database tables created successfully!");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export const GetCompleteUserDetailbyUserId = async (id: Number) => {
  const sql = await neon(DB_URL);
  let user = await sql`SELECT
    u.id,
    u.name,
    u.email,
    u.phone_number,
    u.role,
    u.bio,
    u.resume,
    u.resume_public_id,
    u.profile_picture,
    u.profile_picture_public_id,
    u.subscription,

    COALESCE(
        ARRAY_AGG(s.skill_name)
        FILTER (WHERE s.skill_name IS NOT NULL),
        '{}'
    ) AS skills

FROM users u

LEFT JOIN user_skills us
ON u.id = us.user_id

LEFT JOIN skills s
ON us.skill_id = s.skill_id

WHERE u.id = ${id}

GROUP BY u.id;`
  return user;
}