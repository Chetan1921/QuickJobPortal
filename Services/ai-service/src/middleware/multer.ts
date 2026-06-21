import multer from 'multer';

const storage = multer.memoryStorage();

// Change from .single('file') to .single('resume')
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // Accept only PDF files
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
}).single('file'); // Changed from 'file' to 'resume'

export default upload;