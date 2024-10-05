const multer = require("multer");

const fileSizeError= (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size exceeds limit minimum size is 40kb' });
        }
    }
    next(err);
}

exports.fileSizeError=fileSizeError