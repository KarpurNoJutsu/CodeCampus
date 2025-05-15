const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    certificateNumber: {
        type: String,
        required: true,
        unique: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    completionDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "revoked"],
        default: "active"
    }
});

module.exports = mongoose.model("Certificate", certificateSchema); 