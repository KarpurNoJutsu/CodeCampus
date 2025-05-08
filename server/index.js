const express=require("express");
const app=express();

const userRoute=require('./routes/User');
const profileRoute=require('./routes/Profile');
const paymentRoute=require('./routes/Payments');
const courseRoute=require('./routes/Course');

const database=require("./config/database");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const {cloudinaryConnect}=require("./config/cloudinary");
const fileUpload=require("express-fileupload");
const dotenv=require("dotenv");
dotenv.config();
const PORT=process.env.PORT||4000;

// connect database
database.connect();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)

// cloudinary connection
cloudinaryConnect();

// routes
app.use("/api/v1/auth",userRoute);
app.use("/api/v1/profile",profileRoute);
app.use("/api/v1/course",courseRoute);
app.use("/api/v1/payment",paymentRoute);

// default route
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"your server is up and running....." 
    })
})

// activate the server
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})








