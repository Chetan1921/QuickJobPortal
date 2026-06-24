import TryCatch from "../middleware/TryCatch.js";
import { AuthenticatedRequest } from "../middleware/auth.js";
import GetBufferFromFile from "../utils/Buffer.js";
import ErrorHandler from "../utils/ErrorHandle.js";
import { GetCompleteUserDetailbyUserId, UpdateProfile, UpdateProfilePicture, AddSkillToUser, UpdateResume, RemoveSkillFromUser } from "../utils/db.js";
import axios from 'axios'
import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
dotenv.config();
const DB_URL = process.env.DB_URL || ""


let sql;

export const myprofileController = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user

    return res.status(200).json({
        success: true,
        message: 'User Fetched Successfully',
        user: user
    })

})

export const GetUserProfileByIdController = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const userId = Number(req.params.userId);
    console.log(typeof userId)
    const me = req.user;
    const users = await GetCompleteUserDetailbyUserId(userId);
    if (users.length === 0) {
        throw new ErrorHandler("User not Found in DB", 400);
    }
    const user = users[0];
    user.skills = user.skills || [];
    return res.status(200).json({
        success: true,
        message: 'User Fetched Successfully',
        user: user
    })
})
export const UpdateUserProfileController = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler("Authentication is Required", 400)
    }
    const { name, phoneNo, bio } = req.body;
    const newName = name || user.name;
    const newPhonNo = phoneNo || user.phone_number;
    const newBio = bio || user.bio;
    const users = await UpdateProfile(user.id, newName, newPhonNo, newBio);
    if (users.length === 0) {
        throw new ErrorHandler("Error in Updatting user", 400);
    }
    const Updateduser = users[0];



    return res.status(200).json({
        success: true,
        message: 'User Profile Updated Successfully',
        user: Updateduser
    })

})

// export const UpdateProfilePicController = TryCatch(async (req: AuthenticatedRequest, res, next) => {
//     const user = req.user;
//     if (!user) {
//         throw new ErrorHandler("Authentication is Required", 400)
//     }
//     const file = (req as any).file; // handle jobseeker registration with file if needed 
//     if (!file) {
//         throw new ErrorHandler("Image File is Required", 400);
//     }
//     console.log("user:", user);
//     const oldPublicId = user.profile_picture_public_id
//     //const fileBuffer=GetBufferFromFile(file);
//     const fileBuffer = await GetBufferFromFile(file);
//     if (!fileBuffer || !fileBuffer.content) {
//         throw new ErrorHandler("Error processing the resume file", 500);
//     }
//     const { data } = await axios.post(process.env.UPLOAD_SERVICE + '/api/v1/utils/upload',
//         {
//             buffer: fileBuffer.content,
//             public_id: oldPublicId

//         }
//     )
//     console.log("oldPublicId:  ", oldPublicId);
//     const users = await UpdateProfilePicture(user.id, data.url, data.public_id);

//     if (users.length === 0) {
//         throw new ErrorHandler("Error in Updating Picture", 400);
//     }
//     return res.status(200).json({
//         success: true,
//         message: 'Profile Picture Updated Successfully',
//         user: users[0]

//     })


// })

export const UpdateProfilePicController = TryCatch(
    async (req: AuthenticatedRequest, res, next) => {

        const user = req.user;

        if (!user) {
            throw new ErrorHandler("Authentication is Required", 401);
        }

        const file = (req as any).file;

        if (!file) {
            throw new ErrorHandler("Image File is Required", 400);
        }

        console.log("Updating profile picture for:", user.email);

        const fileBuffer = await GetBufferFromFile(file);

        if (!fileBuffer || !fileBuffer.content) {
            throw new ErrorHandler("Error processing image file", 500);
        }

        const uploadService = process.env.UPLOAD_SERVICE;

        if (!uploadService) {
            throw new ErrorHandler(
                "UPLOAD_SERVICE environment variable is missing",
                500
            );
        }

        const uploadUrl = `${uploadService}/api/v1/utils/upload`;

        console.log("Upload URL:", uploadUrl);
        console.log("Old Public Id:", user.profile_picture_public_id);
        // console.log(
        //     "Buffer Length:",
        //     fileBuffer.content?.length
        // );

        let uploadResponse;

        try {

            uploadResponse = await axios.post(
                uploadUrl,
                {
                    buffer: fileBuffer.content,
                    public_id: user.profile_picture_public_id
                },
                {
                    timeout: 30000,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Upload Service Response:");

        } catch (error: any) {

            console.error("Upload Service Error");


            throw new ErrorHandler(
                "Failed To Upload Profile Picture",
                500
            );
        }

        const { url, public_id } = uploadResponse.data;

        const users = await UpdateProfilePicture(
            user.id,
            url,
            public_id
        );

        if (users.length === 0) {
            throw new ErrorHandler(
                "Error Updating Profile Picture",
                400
            );
        }

        return res.status(200).json({
            success: true,
            message: "Profile Picture Updated Successfully",
            user: users[0]
        });
    }
);



export const UpdateResumeController = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler("Authentication is Required", 400)
    }
    const file = (req as any).file; // handle jobseeker registration with file if needed 
    if (!file) {
        throw new ErrorHandler("Resume file is required ", 400);
    }
    console.log("user:", user);
    const oldPublicId = user.resume_public_id
    //const fileBuffer=GetBufferFromFile(file);
    const fileBuffer = await GetBufferFromFile(file);
    if (!fileBuffer || !fileBuffer.content) {
        throw new ErrorHandler("Error processing the resume file", 500);
    }
    const { data } = await axios.post(process.env.UPLOAD_SERVICE + '/api/v1/utils/upload',
        {
            buffer: fileBuffer.content,
            public_id: oldPublicId

        }
    )

    const users = await UpdateResume(user.id, data.url, data.public_id);

    if (users.length === 0) {
        throw new ErrorHandler("Error in Updating Resume", 400);
    }
    return res.status(200).json({
        success: true,
        message: 'Resume Updated Successfully',
        user: users[0]

    })


})

export const AddSkillsToUserController = TryCatch(async (req: AuthenticatedRequest, res, next) => {

    const { skill } = req.body;

    const userId = req.user?.id;

    if (!userId) {
        throw new ErrorHandler("Unauthorized", 401);
    }

    if (!skill || skill.trim() === "") {
        throw new ErrorHandler("Skill is required", 400);
    }

    const result = await AddSkillToUser(
        userId,
        skill.trim()
    );

    return res.status(200).json({
        success: true,
        message: "Skill Added Successfully",
        data: result
    });
})
export const DeleteSkillFromUserController = TryCatch(
    async (req: AuthenticatedRequest, res, next) => {
        const user = req.user;

        const { skill } = req.body;

        if (!user) {
            throw new ErrorHandler("Unauthorized", 401);
        }

        if (!skill || skill.trim() === "") {
            throw new ErrorHandler("Skill is required", 400);
        }

        const sql = await neon(process.env.DB_URL!);

        // Check if skill exists
        const skillResult = await sql`
            SELECT skill_id
            FROM skills
            WHERE LOWER(skill_name) = LOWER(${skill.trim()})
        `;

        if (skillResult.length === 0) {
            throw new ErrorHandler(
                `${skill} skill does not exist`,
                404
            );
        }

        const skillId = skillResult[0].skill_id;

        // Check whether user has this skill
        const userSkill = await sql`
            SELECT *
            FROM user_skills
            WHERE user_id = ${user.id}
            AND skill_id = ${skillId}
        `;

        if (userSkill.length === 0) {
            throw new ErrorHandler(
                `User does not have ${skill} skill`,
                400
            );
        }

        // Delete skill
        await sql`
            DELETE FROM user_skills
            WHERE user_id = ${user.id}
            AND skill_id = ${skillId}
        `;

        return res.status(200).json({
            success: true,
            message: `${skill} removed successfully`
        });
    }
);
