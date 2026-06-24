import express from 'express'
import { v2 as cloudinary } from 'cloudinary';
const router = express.Router();
router.post('/upload', async (req, res) => {
    try {

        const { buffer, public_id, type } = req.body;
        console.log(1);
        console.log(type);
        const resourceType =
            type === "image"
                ? "image"
                : "raw";

        if (public_id) {
            await cloudinary.uploader.destroy(public_id, {
                resource_type: resourceType
            });
        }
        console.log(2);

        const cloud = await cloudinary.uploader.upload(
            buffer,
            {
                resource_type: resourceType
            }
        );
        console.log(3);

        return res.status(200).json({
            success: true,
            url: cloud.secure_url,
            public_id: cloud.public_id
        });

    } catch (err: any) {

        console.error("UPLOAD ERROR:", err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

export default router;
