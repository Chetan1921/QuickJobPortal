import express from 'express'
import { v2 as cloudinary } from 'cloudinary';
const router = express.Router();

router.post('/upload', async (req, res) => {
    try {

        console.log("====== Upload Request ======");

        const { buffer, public_id } = req.body;

        console.log("Buffer Exists:", !!buffer);
        console.log("Buffer Length:", buffer?.length);
        console.log("Public Id:", public_id);

        if (!buffer) {
            return res.status(400).json({
                success: false,
                message: "Buffer is missing"
            });
        }

        if (public_id) {
            console.log("Deleting old file:", public_id);

            await cloudinary.uploader.destroy(
                public_id,
                { resource_type: "auto" }
            );
        }

        console.log("Uploading to Cloudinary...");

        const cloud = await cloudinary.uploader.upload(
            buffer,
            {
                resource_type: "auto"
            }
        );

        console.log("Upload Success");

        return res.status(200).json({
            success: true,
            url: cloud.secure_url,
            public_id: cloud.public_id
        });

    } catch (err: any) {

        console.error("UPLOAD ERROR:");
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

export default router;
