import asyncHandler from "../../common/utils/asyncHandler.js";
import { Request, Response } from "express";
import { ExecuteCodeDTO } from "./dto.js";
import submissionService from "./service.js";
import { createdResponse, successResponse } from "../../common/utils/response.js";

class SubmissionController {

    executeCode = asyncHandler(async (req: Request, res: Response) => {
        
        const codeExecuteData = req.body as ExecuteCodeDTO;

        const scheduledCodeExecution = await submissionService.executeCode(codeExecuteData);

        createdResponse(
            res,
            scheduledCodeExecution,
            "Code execution scheduled successfully"
        )

    })

    getSubmission = asyncHandler(async (req: Request, res: Response) => {
        
        const { submissionId } = req.params;

        const submission = await submissionService.getSubmission(submissionId as string);
        
        successResponse(
            res,
            "Submission retrieved successfully",
            submission
        )

    })

}

const submissionController = new SubmissionController();

export default submissionController;
