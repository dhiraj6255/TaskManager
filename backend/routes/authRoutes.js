const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();

// Auth Router
router.post('/register', registerUser); // Register User
router.post('/login', loginUser);       // Login User
router.get('/profile', protect, getUserProfile); // Get User Profile
router.put('/profile', protect, updateUserProfile); // Update Profile

router.post("/upload-image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: "Image upload failed" });
        }

        res.status(200).json({
            profileImageUrl: req.file.path, // Cloudinary URL
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;