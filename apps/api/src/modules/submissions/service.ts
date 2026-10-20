
import { NotFoundError } from "../../common/utils/AppError.js";
import { executionQueue } from "../../config/queue.js";
import { ExecuteCodeDTO } from "./dto.js";
import { submissionRepository } from "@repo/db";

class SubmissionService {

    executeCode = async (data: ExecuteCodeDTO) => {
        
        const {
            roomId,
            exerciseId,
            userId,
            sourceCode,
            language,
            type
        } = data;

        const submissionData = {
            roomId,
            exerciseId,
            userId,
            sourceCode,
            language
        }
        
        const submission = await submissionRepository.createSubmission(submissionData);

        await executionQueue.add('execute-code', {
            submissionId: submission.id,
            roomId: submission.room_id,
            userId: submission.participant_id,
            sourceCode: submission.source_code,
            language: submission.language,
            type
        })
        
        return {
            submissionId: submission.id,
            status: "pending",
            message: "Code execution queued"
        }

    }
    
    getSubmission = async (submissionId: string) => {
        
        const submission = await submissionRepository.getSubmissionById(submissionId);

        if(!submission) throw new NotFoundError("Submission Not Found");

        return submission;

    }
}

const submissionService = new SubmissionService();

export default submissionService;
