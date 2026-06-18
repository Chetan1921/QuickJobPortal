import { neon } from "@neondatabase/serverless";
import dotenv from 'dotenv'
import TryCatch from "../middleware/TryCatch.js";
import ErrorHandler from "./ErrorHandle.js";
dotenv.config()
const DB_URL = process.env.DB_URL || ""

console.log("DB_URL:", DB_URL);
let sql;

export const ConnectDB = async () => {
    try {
        sql = await neon(DB_URL);
        console.log("Connected to the database successfully!");
        await sql`
         DO 
         $$ BEGIN
         IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role')
         THEN
         CREATE TYPE user_role AS ENUM ('recruiter', 'job_seeker');
         END IF;
         END $$;`

        // Create users table if it doesn't exist
        await sql`
         CREATE TABLE IF NOT EXISTS users (
             id SERIAL PRIMARY KEY,
             name VARCHAR(255) NOT NULL,
             email VARCHAR(255) UNIQUE NOT NULL,
             password VARCHAR(255) NOT NULL,
             phone_number VARCHAR(20),
             role user_role NOT NULL,
             bio TEXT,
             resume varchar(255),
             resume_public_id varchar(255),
             profile_picture varchar(255),
             profile_picture_public_id varchar(255),
             subscription TIMESTAMPTZ,
             created_at TIMESTAMPTZ DEFAULT NOW(),
             updated_at TIMESTAMPTZ DEFAULT NOW()
             
         );`

        // create Skills Table

        await sql`
         create table if not exists skills(
         skill_id SERIAL PRIMARY KEY,
         skill_name VARCHAR(255) NOT NULL UNIQUE
         )`

        // create user_skills table

        await sql`
         create table if not exists user_skills(
         user_id INT NOT NULL,
         skill_id INT NOT NULL,
         PRIMARY KEY (user_id, skill_id),
         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
         FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
         )`
        console.log("Tables created successfully!");

    }
    catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);

    }
}
export const GetConection = async () => {
    const sql = await neon(DB_URL);
    return sql;
}

export const GetUserByEmail = async (email: string) => {
    const sql = await neon(DB_URL);
    const user = await sql`SELECT id,name,email FROM users WHERE email = ${email}`;
    return user;
}

export const RegisterRecruiter = async (name: string, email: string, password: string, phoneNo: string, role: string) => {
    const sql = await neon(DB_URL);
    const user = await sql`
    INSERT INTO users (name,email,password,phone_number,role) 
    VALUES (${name},${email},${password},${phoneNo},${role}) RETURNING id , name, email, phone_number, role, created_at, updated_at`;
    return user;
}
export const RegisterJobSeeker = async (name: string, email: string, password: string, phoneNo: string, role: string, bio: string, resume: string, reusme_publicID: string) => {
    const sql = await neon(DB_URL);
    const user = await sql`
    INSERT INTO users (name,email,password,phone_number,role,resume,resume_public_id) 
    VALUES (${name},${email},${password},${phoneNo},${role},${resume},${reusme_publicID}) RETURNING id , name, email, phone_number, role,resume,resume_public_id, created_at, updated_at`;
    return user;
}
export const GetCompleteUserDetail = async (email: string) => {
    const sql = await neon(DB_URL)
    const user = await sql`
    SELECT
        u.id,
        u.name,
        u.email,
        u.password,
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

    WHERE u.email = ${email}

    GROUP BY u.id;
    `;
    return user;
}
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
export const UpdateUserPass = async (email: string, password: string) => {
    const sql = await neon(DB_URL)
    let user = await sql`UPDATE users SET password=${password} where email=${email}`;
    return user;
}
export const UpdateProfile = async (userid: Number, name: string, PhoneNo: string, bio: string) => {
    const sql = await neon(DB_URL);
    let user = await sql`UPDATE users 
    SET name= ${name} ,
    phone_number=${PhoneNo},
    bio=${bio} 
    where id=${userid} 
    RETURNING id,name,phone_number,bio
    `
    //   console.log(user);

    return user;
}
export const UpdateProfilePicture = async (id: Number, url: string, public_id: string) => {
    const sql = await neon(DB_URL);
    const user = await sql`
    UPDATE users 
    SET profile_picture=${url},
    profile_picture_public_id=${public_id} 
    where id=${id} 
    RETURNING
    id,name,profile_picture
     `
    return user;
}
export const UpdateResume = async (id: Number, url: string, public_id: string) => {
    const sql = await neon(DB_URL);
    const user = await sql`
    UPDATE users 
    SET resume=${url},
    resume_public_id=${public_id} 
    where id=${id} 
    RETURNING
    id,name,resume
     `
    return user;
}
export const AddSkillToUser = async (userId: Number, skillName: string) => {
    const sql = await neon(DB_URL);

    let skill = await sql`
        SELECT skill_id
        FROM skills
        WHERE LOWER(skill_name) = LOWER(${skillName})
    `;

    let skillId: number;

    if (skill.length === 0) {

        const newSkill = await sql`
            INSERT INTO skills(skill_name)
            VALUES(${skillName})
            RETURNING skill_id
        `;

        skillId = newSkill[0].skill_id;
    }
    else {
        skillId = skill[0].skill_id;
    }

    await sql`
        INSERT INTO user_skills(user_id, skill_id)
        VALUES(${userId}, ${skillId})
        ON CONFLICT(user_id, skill_id)
        DO NOTHING
    `;

    return {
        userId,
        skillId,
        skillName
    };
}
export const RemoveSkillFromUser = async (
    userId: number,
    skillName: string
) => {
    const sql = await neon(DB_URL);

    // Check if skill exists
    const skill = await sql`
        SELECT skill_id
        FROM skills
        WHERE LOWER(skill_name) = LOWER(${skillName})
    `;

    if (skill.length === 0) {
        throw new ErrorHandler(
            `${skillName} skill does not exist`,
            400
        );
    }

    const skillId = skill[0].skill_id;

    // Check if user has this skill
    const userSkill = await sql`
        SELECT *
        FROM user_skills
        WHERE user_id = ${userId}
        AND skill_id = ${skillId}
    `;

    if (userSkill.length === 0) {
        throw new ErrorHandler(
            `User does not have ${skillName} skill`,
            400
        );

    }

    // Delete skill
    await sql`
        DELETE FROM user_skills
        WHERE user_id = ${userId}
        AND skill_id = ${skillId}
    `;

    return {
        userId,
        skillId,
        skillName
    };
};