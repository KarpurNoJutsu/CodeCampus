// Certificate Template Configuration
const certificateTemplate = {
    // Page settings
    page: {
        size: 'A4',
        layout: 'landscape',
        margin: 50,
        background: 'white'
    },

    // Border settings
    border: {
        width: 3,
        color: '#000000',
        margin: 20
    },

    // Text styles
    styles: {
        title: {
            fontSize: 50,
            color: '#000000',
            align: 'center'
        },
        studentName: {
            fontSize: 36,
            color: '#000000',
            align: 'center'
        },
        courseName: {
            fontSize: 30,
            color: '#000000',
            align: 'center'
        },
        regular: {
            fontSize: 20,
            color: '#000000',
            align: 'center'
        },
        details: {
            fontSize: 14,
            color: '#000000',
            align: 'center'
        }
    },

    // Content layout
    content: {
        title: 'Certificate of Completion',
        subtitle: 'This is to certify that',
        completionText: 'has successfully completed the course',
        signatureText: 'Course Instructor'
    }
};

module.exports = certificateTemplate; 