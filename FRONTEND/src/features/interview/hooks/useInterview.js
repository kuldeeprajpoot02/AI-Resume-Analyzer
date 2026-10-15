
import { useContext } from "react";

import { InterviewContext } from "../interview.context";

import {
    generateInterviewReport,
    getInterviewReportById,
    getAllInterviewReports,
    deleteInterviewReport
} from "../services/interview.api";


export const useInterview = () => {
    const context = useContext(InterviewContext);

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports
    } = context;


    // Generate report
    const generateReport = async ({
        jobDescription,
        selfDescription,
        resumeFile
    }) => {
        setLoading(true);

        try {
            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile
            });

            if (!response?.success || !response?.interviewReport) {
                throw new Error(
                    response?.message || "Report generate nahi hui."
                );
            }

            setReport(response.interviewReport);

            return response.interviewReport;

        } catch (error) {
            console.error(
                "REPORT GENERATION ERROR:",
                error?.response?.data || error.message || error
            );

            throw error;

        } finally {
            setLoading(false);
        }
    };


    // Get one report
    const getReportById = async (interviewId) => {
        setLoading(true);

        try {
            const response = await getInterviewReportById(interviewId);

            setReport(response.interviewReport);

            return response.interviewReport;

        } catch (error) {
            console.error(
                "GET REPORT ERROR:",
                error?.response?.data || error.message || error
            );

            throw error;

        } finally {
            setLoading(false);
        }
    };


    // Get all reports
    const getReports = async () => {
        setLoading(true);

        try {
            const response = await getAllInterviewReports();

            setReports(response.interviewReports);

            return response.interviewReports;

        } catch (error) {
            console.error(
                "GET REPORTS ERROR:",
                error?.response?.data || error.message || error
            );

            throw error;

        } finally {
            setLoading(false);
        }
    };


    // Delete report
    const deleteReport = async (interviewId) => {
        setLoading(true);

        try {
            const response = await deleteInterviewReport(interviewId);

            if (!response?.success) {
                throw new Error(
                    response?.message || "Report delete nahi hui."
                );
            }

            // Remove deleted report from History immediately
            setReports((previousReports) =>
                (previousReports || []).filter(
                    (item) => item._id !== interviewId
                )
            );

            // Clear current report if it was deleted
            if (report?._id === interviewId) {
                setReport(null);
            }

            return response;

        } catch (error) {
            console.error(
                "DELETE REPORT ERROR:",
                error?.response?.data || error.message || error
            );

            throw error;

        } finally {
            setLoading(false);
        }
    };


    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        deleteReport
    };
};
