import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserEnrolledCourses } from "../../../../services/operations/profileAPI";
import { FaBook, FaClock, FaTrophy, FaStar, FaFire, FaCertificate } from "react-icons/fa";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import "./Dashboard.css";

const Student = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoading(true);
      const result = await getUserEnrolledCourses(token);
      if (result) {
        setEnrolledCourses(result);
      }
      setLoading(false);
    };
    fetchEnrolledCourses();

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Calculate total progress
  const totalProgress = enrolledCourses.reduce((acc, course) => acc + (course.progressPercentage || 0), 0) / (enrolledCourses.length || 1);

  // Calculate total learning hours
  const totalLearningHours = enrolledCourses.reduce((acc, course) => {
    const duration = course.totalDuration?.split(" ")[0] || 0;
    return acc + parseInt(duration);
  }, 0);

  return (
    <div className="text-white mt-6 relative">
      {/* Welcome Section with Animated Gradient */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-xl mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x"></div>
        <div className="relative backdrop-blur-md bg-white/10 p-8">
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center shadow-lg"
            >
              <span className="text-2xl text-richblack-900 font-bold">
                {user.firstName[0]}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold">{greeting}, {user.firstName}! 👋</h1>
              <p className="text-richblack-300 mt-1">Keep up the great work in your learning journey!</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="custom-loader"></div>
        </div>
      ) : (
        <div>
          {/* Learning Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-richblack-800/80 backdrop-blur-sm rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaBook className="text-richblack-900 text-xl" />
                </div>
                <div>
                  <p className="text-richblack-300 text-sm">Courses Enrolled</p>
                  <p className="text-2xl font-bold">
                    <CountUp end={enrolledCourses.length} duration={2} />
                  </p>
                  <div className="w-full bg-richblack-700 rounded-full h-1.5 mt-2">
                    <div className="bg-blue-100 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-richblack-800/80 backdrop-blur-sm rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaClock className="text-richblack-900 text-xl" />
                </div>
                <div>
                  <p className="text-richblack-300 text-sm">Learning Hours</p>
                  <p className="text-2xl font-bold">
                    <CountUp end={totalLearningHours} duration={2} />
                  </p>
                  <div className="w-full bg-richblack-700 rounded-full h-1.5 mt-2">
                    <div className="bg-green-100 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-richblack-800/80 backdrop-blur-sm rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <FaTrophy className="text-richblack-900 text-xl" />
                </div>
                <div>
                  <p className="text-richblack-300 text-sm">Overall Progress</p>
                  <p className="text-2xl font-bold">
                    <CountUp end={Math.round(totalProgress)} duration={2} />%
                  </p>
                  <div className="w-full bg-richblack-700 rounded-full h-1.5 mt-2">
                    <div className="bg-yellow-100 h-1.5 rounded-full" style={{ width: `${totalProgress}%` }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enrolled Courses Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Learning Journey</h2>
              <Link to="/dashboard/enrolled-courses" className="text-yellow-200 hover:text-yellow-100 transition-colors duration-200">
                View all courses →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.slice(0, 3).map((course, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-richblack-800/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg group"
                >
                  <div className="relative">
                    <img 
                      src={course.thumbnail} 
                      alt={course.courseName}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-richblack-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      {course.progressPercentage || 0}% Complete
                    </div>
                    <div className="absolute top-2 left-2 flex gap-2">
                      {course.progressPercentage === 100 && (
                        <span className="bg-green-100 text-richblack-900 px-2 py-1 rounded-full text-xs font-semibold">
                          Completed
                        </span>
                      )}
                      {course.progressPercentage > 0 && course.progressPercentage < 100 && (
                        <span className="bg-yellow-100 text-richblack-900 px-2 py-1 rounded-full text-xs font-semibold">
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{course.courseName}</h3>
                    <div className="flex items-center gap-4 text-sm text-richblack-300">
                      <div className="flex items-center gap-1">
                        <FaClock className="text-yellow-100" />
                        <span>{course.totalDuration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-100" />
                        <span>{course.rating || "New"}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-richblack-700 rounded-full h-2">
                        <div 
                          className="bg-yellow-100 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.progressPercentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Your Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-richblack-800/80 backdrop-blur-sm rounded-xl p-4 text-center hover:scale-105 transition-all duration-300"
              >
                <div className="bg-yellow-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <FaFire className="text-richblack-900 text-2xl" />
                </div>
                <h3 className="font-semibold">Learning Streak</h3>
                <p className="text-richblack-300 text-sm">3 days</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="bg-richblack-800/80 backdrop-blur-sm rounded-xl p-4 text-center hover:scale-105 transition-all duration-300"
              >
                <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <FaCertificate className="text-richblack-900 text-2xl" />
                </div>
                <h3 className="font-semibold">Certificates</h3>
                <p className="text-richblack-300 text-sm">2 earned</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 }}
                className="bg-richblack-800/80 backdrop-blur-sm rounded-xl p-4 text-center hover:scale-105 transition-all duration-300"
              >
                <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <FaBook className="text-richblack-900 text-2xl" />
                </div>
                <h3 className="font-semibold">Courses Completed</h3>
                <p className="text-richblack-300 text-sm">{enrolledCourses.filter(course => course.progressPercentage === 100).length}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 }}
                className="bg-richblack-800/80 backdrop-blur-sm rounded-xl p-4 text-center hover:scale-105 transition-all duration-300"
              >
                <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <FaStar className="text-richblack-900 text-2xl" />
                </div>
                <h3 className="font-semibold">Top Student</h3>
                <p className="text-richblack-300 text-sm">2 courses</p>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Student; 