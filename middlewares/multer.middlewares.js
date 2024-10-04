const multer = require('multer')
const storage = multer.memoryStorage()
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 40 * 1024, // 40 KB size limit
    },
  });
  exports.upload = upload;