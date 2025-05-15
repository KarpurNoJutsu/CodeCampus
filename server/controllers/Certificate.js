const Certificate = require("../models/Certificate");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const User = require("../models/User");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const certificateTemplate = require("../certificate-templates/template");

// Generate a unique certificate number
const generateCertificateNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CERT-${timestamp}-${random}`;
};

// Generate certificate PDF
const generateCertificatePDF = async (user, course, certificateNumber) => {
    try {
        console.log("Starting certificate generation for:", {
            user: user.firstName + " " + user.lastName,
            course: course.courseName,
            certificateNumber
        });

        // Create certificates directory if it doesn't exist
        const certDir = path.join(__dirname, '../certificates');
        console.log("Certificate directory path:", certDir);
        
        if (!fs.existsSync(certDir)) {
            console.log("Creating certificates directory");
            fs.mkdirSync(certDir, { recursive: true });
        }

        // Create a new PDF document using template settings
        console.log("Creating PDF document with settings:", certificateTemplate.page);
        const doc = new PDFDocument(certificateTemplate.page);

        const filePath = path.join(certDir, `${certificateNumber}.pdf`);
        console.log("Certificate will be saved at:", filePath);
        
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Set white background
        doc.rect(0, 0, doc.page.width, doc.page.height)
           .fillColor('white')
           .fill();

        // Add border using template settings
        doc.rect(
            certificateTemplate.border.margin,
            certificateTemplate.border.margin,
            doc.page.width - (certificateTemplate.border.margin * 2),
            doc.page.height - (certificateTemplate.border.margin * 2)
        )
        .lineWidth(certificateTemplate.border.width)
        .strokeColor(certificateTemplate.border.color)
        .stroke();

        // Platform/Organization Name
        doc.fontSize(18)
           .fillColor('#22223b')
           .text('Study Byte', { align: 'left' });

        // Add header using template styles
        doc.moveDown(1.5)
           .fontSize(certificateTemplate.styles.title.fontSize)
           .fillColor(certificateTemplate.styles.title.color)
           .text(certificateTemplate.content.title, {
               align: certificateTemplate.styles.title.align,
               valign: 'center'
           })
           .moveDown(1);

        // Statement of achievement
        doc.fontSize(20)
           .fillColor('#000000')
           .text('This is to certify that', { align: 'center' })
           .moveDown(1);

        // Student name
        doc.fontSize(36)
           .fillColor('#000000')
           .text(`${user.firstName} ${user.lastName}`, { align: 'center' })
           .moveDown(0.5);

        // Student email
        doc.fontSize(16)
           .fillColor('#444444')
           .text(user.email, { align: 'center' })
           .moveDown(1);

        // Course completion text
        doc.fontSize(20)
           .fillColor('#000000')
           .text('has successfully completed the course', { align: 'center' })
           .moveDown(0.5);

        // Course name
        doc.fontSize(30)
           .fillColor('#000000')
           .text(course.courseName, { align: 'center' })
           .moveDown(1);

        // Course duration (if available)
        let startDate = course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A';
        let endDate = new Date().toLocaleDateString();
        doc.fontSize(14)
           .fillColor('#000000')
           .text(`Course Duration: ${startDate} - ${endDate}`, { align: 'center' })
           .moveDown(0.5);

        // Completion date
        doc.fontSize(14)
           .fillColor('#000000')
           .text(`Completion Date: ${endDate}`, { align: 'center' })
           .moveDown(0.5);

        // Certificate number
        doc.fontSize(14)
           .fillColor('#000000')
           .text(`Certificate Number: ${certificateNumber}`, { align: 'center' })
           .moveDown(0.5);

        // Instructor name (from course data)
        let instructorName = course.instructor ? (course.instructor.firstName + ' ' + course.instructor.lastName) : 'Course Instructor';
        doc.moveDown(2);
        doc.fontSize(16)
           .fillColor('#000000')
           .text('_____________________________', { align: 'center' })
           .text(instructorName, { align: 'center' })
           .moveDown(0.5);

        // Date of issue
        doc.fontSize(12)
           .fillColor('#000000')
           .text(`Date of Issue: ${endDate}`, { align: 'center' })
           .moveDown(1);

        // Footer (optional)
        doc.fontSize(10)
           .fillColor('#888888')
           .text('This certificate is issued by Study Byte. For verification, contact support@studybyte.com', { align: 'center' });

        console.log("PDF content generation completed, ending document");
        doc.end();

        return new Promise((resolve, reject) => {
            writeStream.on('finish', () => {
                console.log("PDF file write completed successfully");
                resolve(`/certificates/${certificateNumber}.pdf`);
            });
            writeStream.on('error', (error) => {
                console.error("Error writing PDF file:", error);
                reject(error);
            });
        });
    } catch (error) {
        console.error("Error in generateCertificatePDF:", error);
        throw error;
    }
};

// Generate certificate for a completed course
exports.generateCertificate = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        console.log("Generating certificate for:", { courseId, userId });

        // Check if course exists and user is enrolled
        const course = await Course.findOne({
            _id: courseId,
            studentsEnrolled: userId
        }).populate({
            path: 'courseContent',
            populate: {
                path: 'SubSection'
            }
        });

        if (!course) {
            console.log("Course not found or user not enrolled");
            return res.status(404).json({
                success: false,
                message: "Course not found or user not enrolled"
            });
        }

        // Check if course is completed
        const courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId
        });

        if (!courseProgress) {
            console.log("Course progress not found");
            return res.status(404).json({
                success: false,
                message: "Course progress not found"
            });
        }

        // Get total number of videos in course
        let totalVideos = 0;
        course.courseContent.forEach(section => {
            if (section.SubSection) {
                totalVideos += section.SubSection.length;
            }
        });

        console.log("Course progress:", {
            completedVideos: courseProgress.completedVideos.length,
            totalVideos
        });

        // Check if all videos are completed
        if (courseProgress.completedVideos.length !== totalVideos) {
            console.log("Course not completed yet");
            return res.status(400).json({
                success: false,
                message: "Course not completed yet"
            });
        }

        // Check if certificate already exists
        const existingCertificate = await Certificate.findOne({
            userId,
            courseId
        });

        if (existingCertificate) {
            // Check if PDF file exists
            const pdfPath = path.join(__dirname, '../certificates', `${existingCertificate.certificateNumber}.pdf`);
            if (!fs.existsSync(pdfPath)) {
                // Regenerate PDF
                const user = await User.findById(userId);
                await generateCertificatePDF(user, course, existingCertificate.certificateNumber);
                console.log('Regenerated missing certificate PDF.');
            }
            return res.status(200).json({
                success: true,
                message: "Certificate already exists",
                data: {
                    certificate: existingCertificate,
                    pdfPath: `/certificates/${existingCertificate.certificateNumber}.pdf`
                }
            });
        }

        // Generate new certificate
        const user = await User.findById(userId);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const certificateNumber = generateCertificateNumber();
        console.log("Generated certificate number:", certificateNumber);

        const certificate = await Certificate.create({
            userId,
            courseId,
            certificateNumber,
            completionDate: new Date()
        });

        console.log("Certificate record created:", certificate);

        // Generate PDF
        const pdfPath = await generateCertificatePDF(user, course, certificateNumber);
        console.log("PDF generated successfully at:", pdfPath);

        return res.status(200).json({
            success: true,
            message: "Certificate generated successfully",
            data: {
                certificate,
                pdfPath
            }
        });

    } catch (error) {
        console.error("Error in generateCertificate:", error);
        return res.status(500).json({
            success: false,
            message: "Error generating certificate",
            error: error.message
        });
    }
};

// Get certificate for a course
exports.getCertificate = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        console.log("Getting certificate for:", { courseId, userId });

        const certificate = await Certificate.findOne({
            userId,
            courseId
        });

        if (!certificate) {
            console.log("Certificate not found");
            return res.status(404).json({
                success: false,
                message: "Certificate not found"
            });
        }

        const pdfPath = path.join(__dirname, '../certificates', `${certificate.certificateNumber}.pdf`);
        console.log("Looking for certificate at path:", pdfPath);
        
        if (!fs.existsSync(pdfPath)) {
            console.log("Certificate PDF not found at path:", pdfPath);
            return res.status(404).json({
                success: false,
                message: "Certificate PDF not found"
            });
        }

        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Certificate-${certificate.certificateNumber}.pdf`);
        
        // Stream the file
        const fileStream = fs.createReadStream(pdfPath);
        fileStream.on('error', (error) => {
            console.error("Error streaming certificate file:", error);
            res.status(500).json({
                success: false,
                message: "Error streaming certificate file",
                error: error.message
            });
        });
        
        fileStream.pipe(res);

    } catch (error) {
        console.error("Error in getCertificate:", error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving certificate",
            error: error.message
        });
    }
}; 