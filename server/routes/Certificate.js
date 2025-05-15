const express = require("express");
const { auth, isStudent } = require("../middlewares/auth");
const { generateCertificate, getCertificate } = require("../controllers/Certificate");

const router = express.Router();

// Generate certificate for a completed course
router.post("/generate", auth, isStudent, generateCertificate);

// Get certificate for a course
router.get("/:courseId", auth, isStudent, getCertificate);

module.exports = router; 