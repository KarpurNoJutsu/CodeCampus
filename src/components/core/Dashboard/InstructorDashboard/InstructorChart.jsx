import React, { useState, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { FaChartPie, FaRupeeSign, FaDownload, FaCalendarAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import '../../../../styles/datepicker.css';

Chart.register(...registerables);

const InstructorChart = ({ courses }) => {
    const [currChart, setCurrChart] = useState("students");
    const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const [endDate, setEndDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const chartRef = useRef(null);

    // Generate consistent colors based on course names
    const generateColors = (labels) => {
        const baseColors = [
            '#FF6B6B', // Coral
            '#4ECDC4', // Turquoise
            '#45B7D1', // Sky Blue
            '#96CEB4', // Sage
            '#FFEEAD', // Cream
            '#D4A5A5', // Dusty Rose
            '#9B59B6', // Purple
            '#3498DB', // Blue
            '#E67E22', // Orange
            '#2ECC71', // Green
        ];

        return labels.map((_, index) => baseColors[index % baseColors.length]);
    };

    // Filter courses based on date range
    const filteredCourses = courses.filter(course => {
        const courseDate = new Date(course.createdAt);
        return courseDate >= startDate && courseDate <= endDate;
    });

    // Create data for chart displaying student info
    const chartDataForStudents = {
        labels: filteredCourses.map((course) => course.courseName),
        datasets: [
            {
                data: filteredCourses.map((course) => course.totalStudentsEnrolled),
                backgroundColor: generateColors(filteredCourses.map(course => course.courseName)),
                borderWidth: 2,
                borderColor: '#1E293B',
                hoverOffset: 4,
            }
        ]
    };

    // Create data for chart displaying income info
    const chartDataForIncome = {
        labels: filteredCourses.map((course) => course.courseName),
        datasets: [
            {
                data: filteredCourses.map((course) => course.totalAmountGenerated),
                backgroundColor: generateColors(filteredCourses.map(course => course.courseName)),
                borderWidth: 2,
                borderColor: '#1E293B',
                hoverOffset: 4,
            }
        ]
    };

    // Chart options
    const options = {
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#E2E8F0',
                    font: {
                        size: 12
                    },
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: '#1E293B',
                titleColor: '#E2E8F0',
                bodyColor: '#E2E8F0',
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        maintainAspectRatio: false,
        responsive: true,
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };

    const handleDownload = (format) => {
        if (!chartRef.current) return;
        
        const canvas = chartRef.current.canvas;
        const link = document.createElement('a');
        
        if (format === 'png') {
            link.download = `${currChart}-chart.png`;
            link.href = canvas.toDataURL('image/png');
        } else if (format === 'csv') {
            const data = currChart === 'students' ? chartDataForStudents : chartDataForIncome;
            const csvContent = [
                ['Course', currChart === 'students' ? 'Students' : 'Income'],
                ...data.labels.map((label, i) => [label, data.datasets[0].data[i]])
            ].map(row => row.join(',')).join('\n');
            
            link.download = `${currChart}-chart.csv`;
            link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
        }
        
        link.click();
    };

    return (
        <div className='bg-richblack-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg'>
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold'>Course Analytics</h2>
                <div className='flex items-center gap-4'>
                    <div className='flex gap-2 bg-richblack-700 p-1 rounded-lg'>
                        <button 
                            onClick={() => setCurrChart("students")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                currChart === "students" 
                                ? "bg-yellow-100 text-richblack-900" 
                                : "text-richblack-300 hover:text-white"
                            }`}
                        >
                            <FaChartPie />
                            Students
                        </button>
                        <button 
                            onClick={() => setCurrChart("income")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                currChart === "income" 
                                ? "bg-yellow-100 text-richblack-900" 
                                : "text-richblack-300 hover:text-white"
                            }`}
                        >
                            <FaRupeeSign />
                            Income
                        </button>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-richblack-700 text-richblack-300 hover:text-white transition-colors duration-200"
                        >
                            <FaCalendarAlt />
                            Date Range
                        </button>
                        <AnimatePresence>
                            {showDatePicker && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 bg-richblack-800 rounded-lg shadow-lg p-4 z-10"
                                >
                                    <div className="flex flex-col gap-2">
                                        <DatePicker
                                            selected={startDate}
                                            onChange={date => setStartDate(date)}
                                            selectsStart
                                            startDate={startDate}
                                            endDate={endDate}
                                            className="bg-richblack-700 text-white px-3 py-2 rounded-lg"
                                        />
                                        <DatePicker
                                            selected={endDate}
                                            onChange={date => setEndDate(date)}
                                            selectsEnd
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={startDate}
                                            className="bg-richblack-700 text-white px-3 py-2 rounded-lg"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleDownload('png')}
                            className="p-2 rounded-lg bg-richblack-700 text-richblack-300 hover:text-white transition-colors duration-200"
                            title="Download as PNG"
                        >
                            <FaDownload />
                        </button>
                        <button
                            onClick={() => handleDownload('csv')}
                            className="p-2 rounded-lg bg-richblack-700 text-richblack-300 hover:text-white transition-colors duration-200"
                            title="Download as CSV"
                        >
                            CSV
                        </button>
                    </div>
                </div>
            </div>
            <div className='h-[400px] flex items-center justify-center'>
                <Pie 
                    ref={chartRef}
                    data={currChart === "students" ? chartDataForStudents : chartDataForIncome}
                    options={options}
                />
            </div>
        </div>
    );
};

export default InstructorChart;