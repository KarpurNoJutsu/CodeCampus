import React from "react";
import { useState, useEffect } from "react";
import { getInstructorData } from "../../../../services/operations/profileAPI";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import InstructorChart from "./InstructorChart";
import Spinner from "../../../common/Spinner";
import { FaGraduationCap, FaUsers, FaRupeeSign, FaHeart, FaShare, FaBookmark } from "react-icons/fa";
import CountUp from 'react-countup';
import { motion } from "framer-motion";
import "./Dashboard.css";

const Instructor = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const getCourseDataWithStats = async () => {
      setLoading(true);
      const instructorApiData = await getInstructorData(token);
      const result = await fetchInstructorCourses(token);
      if (instructorApiData.length) {
        setInstructorData(instructorApiData);
      }
      if (result) {
        setCourses(result);
      }
      setLoading(false);
    };
    getCourseDataWithStats();

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );
  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  );

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
              <p className="text-richblack-300 mt-1">Let's continue making an impact through education</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner />
        </div>
      ) : courses.length > 0 ? (
        <div>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Chart Section */}
            <div className="lg:w-[70%]">
              <InstructorChart courses={instructorData} className="flex" />
            </div>

            {/* Statistics Cards */}
            <div className="lg:w-[30%] space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-richblack-800/80 backdrop-blur-sm rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <FaGraduationCap className="text-richblack-900 text-xl" />
                  </div>
                  <div>
                    <p className="text-richblack-300 text-sm">Total Courses</p>
                    <p className="text-2xl font-bold">
                      <CountUp end={courses.length} duration={2} />
                    </p>
                    <div className="w-full bg-richblack-700 rounded-full h-1.5 mt-2">
                      <div className="bg-yellow-100 h-1.5 rounded-full" style={{ width: '100%' }}></div>
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
                  <div className="bg-pink-100 p-3 rounded-lg">
                    <FaUsers className="text-richblack-900 text-xl" />
                  </div>
                  <div>
                    <p className="text-richblack-300 text-sm">Total Students</p>
                    <p className="text-2xl font-bold">
                      <CountUp end={totalStudents} duration={2} />
                    </p>
                    <div className="w-full bg-richblack-700 rounded-full h-1.5 mt-2">
                      <div className="bg-pink-100 h-1.5 rounded-full" style={{ width: '100%' }}></div>
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
                  <div className="bg-green-100 p-3 rounded-lg">
                    <FaRupeeSign className="text-richblack-900 text-xl" />
                  </div>
                  <div>
                    <p className="text-richblack-300 text-sm">Total Income</p>
                    <p className="text-2xl font-bold">
                      ₹<CountUp end={totalAmount} duration={2} />
                    </p>
                    <div className="w-full bg-richblack-700 rounded-full h-1.5 mt-2">
                      <div className="bg-green-100 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Courses Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Courses</h2>
              <Link to="/dashboard/my-courses" className="text-yellow-200 hover:text-yellow-100 transition-colors duration-200">
                View all courses →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course, index) => (
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
                      ₹{course.price}
                    </div>
                    <div className="absolute top-2 left-2 flex gap-2">
                      {course.studentsEnrolled.length > 50 && (
                        <span className="bg-yellow-100 text-richblack-900 px-2 py-1 rounded-full text-xs font-semibold">
                          Popular
                        </span>
                      )}
                      {new Date(course.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                        <span className="bg-green-100 text-richblack-900 px-2 py-1 rounded-full text-xs font-semibold">
                          New
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="bg-richblack-900/80 backdrop-blur-sm p-2 rounded-full hover:bg-yellow-100 hover:text-richblack-900 transition-colors duration-200">
                        <FaHeart />
                      </button>
                      <button className="bg-richblack-900/80 backdrop-blur-sm p-2 rounded-full hover:bg-yellow-100 hover:text-richblack-900 transition-colors duration-200">
                        <FaShare />
                      </button>
                      <button className="bg-richblack-900/80 backdrop-blur-sm p-2 rounded-full hover:bg-yellow-100 hover:text-richblack-900 transition-colors duration-200">
                        <FaBookmark />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{course.courseName}</h3>
                    <div className="flex items-center gap-4 text-sm text-richblack-300">
                      <div className="flex items-center gap-1">
                        <FaUsers className="text-yellow-100" />
                        <span>{course.studentsEnrolled.length} students</span>
                      </div>
                      <span className="px-2 py-1 bg-richblack-700 rounded-full text-xs">
                        {course.difficulty || "Beginner"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="bg-richblack-800/80 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Start Your Teaching Journey, {user.firstName}!</h2>
            <p className="text-richblack-300 mb-6">Share your knowledge with the world and inspire others to learn.</p>
            <div className="flex flex-col gap-4">
              <Link 
                to="/dashboard/add-Course" 
                className="inline-block bg-yellow-100 text-richblack-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-200 transition-colors duration-200"
              >
                Create Your First Course
              </Link>
              <Link 
                to="/dashboard/explore" 
                className="inline-block text-yellow-100 hover:text-yellow-200 transition-colors duration-200"
              >
                Explore Trending Courses →
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Instructor;
