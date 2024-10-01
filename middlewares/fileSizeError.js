const multer = require("multer");

const fileSizeError= (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).send('File size is too large. Maximum allowed size is 20 KB.');
        }
    }
    next(err);
}

exports.fileSizeError=fileSizeError