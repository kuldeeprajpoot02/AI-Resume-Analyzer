
import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api/interview",
    withCredentials: true
});


// Generate a new interview report
export const generateInterviewReport = async ({
    jobDescription,
    selfDescription,
    resumeFile
}) => {
    const formData = new FormData();

    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription || "");
    formData.append("resume", resumeFile);

    const response = await API.post("/", formData);

    return response.data;
};


// Get one report by ID
export const getInterviewReportById = async (interviewId) => {
    const response = await API.get(`/${interviewId}`);

    return response.data;
};


// Get all reports
export const getAllInterviewReports = async () => {
    const response = await API.get("/");

    return response.data;
};


// Delete one report
export const deleteInterviewReport = async (interviewId) => {
    const response = await API.delete(`/${interviewId}`);

    return response.data;
};
