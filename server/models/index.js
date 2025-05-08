const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["Admin", "Student", "Instructor"],
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    approved: {
      type: Boolean,
      default: true,
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }],
    token: String,
    resetPasswordExpires: Date,
    image: {
      type: String,
      required: true,
    },
    courseProgress: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseProgress",
    }],
  },
  { timestamps: true }
);

// Profile Schema
const profileSchema = new mongoose.Schema({
  gender: String,
  dateOfBirth: String,
  about: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: Number,
    trim: true,
  },
});

// Course Schema
const courseSchema = new mongoose.Schema({
  courseName: { 
    type: String,
    required: true,
  },
  courseDescription: { 
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  whatYouWillLearn: {
    type: String,
    required: true,
  },
  courseContent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
  }],
  ratingAndReviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "RatingAndReview",
  }],
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  tag: {
    type: [String],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  studentsEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  instructions: {
    type: [String],
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
    default: "Draft",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Section Schema
const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
  },
  SubSection: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "SubSection",
  }],
});

// SubSection Schema
const subSectionSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true,
  },
  timeDuration: { 
    type: String,
    required: true,
  },
  description: { 
    type: String,
    required: true,
  },
  videoUrl: { 
    type: String,
    required: true,
  },
});

// Rating and Review Schema
const ratingAndReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
    index: true,
  },
});

// Category Schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: { 
    type: String,
    required: true,
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  }],
});

// OTP Schema
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // Document will be automatically deleted after 5 minutes
  },
});

// Course Progress Schema
const courseProgressSchema = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  completedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubSection",
  }],
});

// Create and export models
const User = mongoose.model("User", userSchema);
const Profile = mongoose.model("Profile", profileSchema);
const Course = mongoose.model("Course", courseSchema);
const Section = mongoose.model("Section", sectionSchema);
const SubSection = mongoose.model("SubSection", subSectionSchema);
const RatingAndReview = mongoose.model("RatingAndReview", ratingAndReviewSchema);
const Category = mongoose.model("Category", categorySchema);
const OTP = mongoose.model("OTP", otpSchema);
const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);

module.exports = {
  User,
  Profile,
  Course,
  Section,
  SubSection,
  RatingAndReview,
  Category,
  OTP,
  CourseProgress,
}; 