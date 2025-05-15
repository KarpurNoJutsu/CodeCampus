import { apiConnector } from "../apiConnector";
import { certificateEndpoints } from "../apis";
import { toast } from "react-hot-toast";

const { GENERATE_CERTIFICATE_API, GET_CERTIFICATE_API } = certificateEndpoints;

// Generate certificate for a completed course
export const generateCertificate = async (courseId, token) => {
    try {
        const response = await apiConnector("POST", GENERATE_CERTIFICATE_API, { courseId }, {
            Authorization: `Bearer ${token}`,
        });

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Could not generate certificate");
        }

        toast.success("Certificate generated successfully!");
        return response.data;
    } catch (error) {
        console.log("GENERATE_CERTIFICATE_API API ERROR............", error);
        toast.error(error.message);
        throw error;
    }
};

// Get certificate for a course
export const getCertificate = async (courseId, token) => {
    try {
        const response = await apiConnector("GET", `${GET_CERTIFICATE_API}/${courseId}`, null, {
            Authorization: `Bearer ${token}`,
        });

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Could not get certificate");
        }

        return response.data;
    } catch (error) {
        console.log("GET_CERTIFICATE_API API ERROR............", error);
        toast.error(error.message);
        throw error;
    }
}; 