import express from 'express'
import { v2 as cloudinary } from 'cloudinary';
const router = express.Router();

router.post('/upload', async (req, res) => {
    try {
        const { buffer, oldPublicId } = req.body;

        // Delete old file if provided
        if (oldPublicId) {
            await cloudinary.uploader.destroy(oldPublicId, {
                resource_type: "raw"
            });
        }

        const cloud = await cloudinary.uploader.upload(buffer, {
            resource_type: "auto"
        });

        return res.status(200).json({
            url: cloud.secure_url,
            public_id: cloud.public_id
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
})

export default router;