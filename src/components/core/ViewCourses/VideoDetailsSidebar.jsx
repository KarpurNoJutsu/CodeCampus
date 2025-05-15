import { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaCertificate } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import IconBtn from "../../common/IconBtn";
import { generateCertificate } from "../../../services/operations/certificateAPI";

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const navigate = useNavigate();
  const { sectionId, subSectionId } = useParams();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    (() => {
      if (!courseSectionData.length) return;
      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data._id === sectionId
      );
      const currentSubSectionIndx = courseSectionData?.[
        currentSectionIndx
      ]?.SubSection.findIndex((data) => data._id === subSectionId);
      console.log("couttent subsection index", currentSectionIndx);
      console.log("this is scourse sectio data", courseSectionData);
      const activeSubSectionId =
        courseSectionData[currentSectionIndx]?.SubSection?.[
          currentSubSectionIndx
        ]?._id;
      console.log("acitve al".activeSubSectionId);
      // set current section here
      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id);
      // set current suvsection here
      setVideoBarActive(activeSubSectionId);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname]);

  const ShowOrHideSideBar=()=>{
    let navigateIconLeft=document.getElementById("NavigateLeftBtn").classList;
    console.log(navigateIconLeft)
    let navigateIconRight=document.getElementById("NavigateRightBtn").classList;
    let SideBar=document.getElementById("SideBar").style;
    // navigateIconLeft.replace("visible","hidden")
    if(navigateIconLeft==="visible"){
      navigateIconLeft.replace("visible","hidden");
      navigateIconRight.replace("hidden","visible");
      SideBar.width="40px";
    }
    else{
      navigateIconLeft.replace("hidden","visible");
      navigateIconRight.replace("visible","hidden");
      SideBar.width="320px";
    }
    
  }

  const handleGenerateCertificate = async () => {
    try {
      const response = await generateCertificate(courseEntireData._id, token);
      console.log("Response from backend:", response);
      if (response.success) {
        const downloadUrl = `${process.env.REACT_APP_BASE_URL}${response.data.pdfPath}`;
        console.log("Download URL:", downloadUrl);
        // Force download using a temporary anchor element
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `Certificate-${courseEntireData.courseName}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Certificate downloaded!");
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast.error(error.message || "Failed to generate certificate");
    }
  };

  // Check if course is completed
  const isCourseCompleted = () => {
    if (!courseEntireData?.courseContent || !completedLectures) return false;
    
    let totalVideos = 0;
    courseEntireData.courseContent.forEach(section => {
      totalVideos += section.SubSection.length;
    });
    
    return completedLectures.length === totalVideos;
  };

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 relative transition-all" id="SideBar">
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          <div className="flex w-full items-center justify-between ">
            <div
              onClick={() => {
                navigate(`/dashboard/enrolled-courses`);
              }}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
              title="back"
            >
              <IoIosArrowBack size={30} />
            </div>
            <IconBtn
              text="Add Review"
              customClasses="ml-auto"
              onclick={() => setReviewModal(true)}
            />
          </div>
          <div className="flex flex-col">
            <p>{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
          {isCourseCompleted() && (
            <button
              onClick={handleGenerateCertificate}
              className="flex items-center gap-2 rounded-md bg-yellow-50 px-4 py-2 text-richblack-900 hover:bg-yellow-100"
            >
              <FaCertificate className="text-xl" />
              Get Certificate
            </button>
          )}
        </div>

        <div className="h-[calc(100vh - 5rem)] overflow-y-auto ">
          {courseSectionData.map((course, index) => (
            <div
              className="mt-2 cursor-pointer text-sm text-richblack-5"
              onClick={() => setActiveStatus(course?._id)}
              key={index}
            >
              {/* Section */}
              <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                <div className="w-[70%] font-semibold">
                  {course?.sectionName}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-medium">
                    Lession {course?.SubSection.length}
                  </span>
                  <span
                    className={`${
                      activeStatus === course?.sectionName
                        ? "rotate-0"
                        : "rotate-180"
                    } transition-all duration-500`}
                  >
                    <BsChevronDown />
                  </span>
                </div>
              </div>

              {/* Sub Sections */}
              {activeStatus === course?._id && (
                <div className="transition-[height] duration-500 ease-in-out">
                  {course.SubSection.map((topic, i) => (
                    <div
                      className={`flex gap-3  px-5 py-2 ${
                        videoBarActive === topic._id
                          ? "bg-yellow-200 font-semibold text-richblack-800"
                          : "hover:bg-richblack-900"
                      } `}
                      key={i}
                      onClick={() => {
                        navigate(
                          `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                        );
                        setVideoBarActive(topic._id);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completedLectures.includes(topic?._id)}
                        onChange={() => {}}
                      />
                      {topic.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button className="text-white text-4xl absolute bottom-2 right-2"  onClick={ShowOrHideSideBar}>
            <FaAngleDoubleLeft id="NavigateLeftBtn" className="visible" />
            <FaAngleDoubleRight id="NavigateRightBtn" className="hidden" />
          </button>
        </div>
      </div>
    </>
  );
}
