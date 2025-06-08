const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "taskmanager_uploads",
        transformation: [{ width: 800, height: 800, crop: "limit" }],
    },
});

const upload = multer({ storage });

module.exports = upload