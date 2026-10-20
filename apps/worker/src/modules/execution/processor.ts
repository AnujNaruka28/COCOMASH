import { createWorker } from "@repo/config";
import { ExecutionJobData } from "./dto.js";
import { publishExecutionResult } from "./publisher.js";
import { executor } from "./executor.js";
import { submissionRepository } from "@repo/db";

const worker = createWorker<ExecutionJobData>(

    'code-execution',

    async (job) => {

        const {
            submissionId,
            roomId, 
            sourceCode,
            language,
            type
        } = job.data;

        try {

            await submissionRepository.updateSubmissionStatus(submissionId,'running');
            
            await publishExecutionResult(roomId, {
                submissionId,
                status: 'running'
            });

            const result = await executor.execute(sourceCode, language, type);

            console.log(result);

            // Check if execution failed (non-zero exit code or error output)
            const executionFailed = 
                result?.exitCode !== 0 || 
                (result?.error && result.error.trim() !== '');

            const status = executionFailed ? 'failed' : 'completed';

            await submissionRepository.updateSubmissionStatus(
                submissionId,
                status,
                {
                    output: result?.output,
                    error: result?.error,
                    exit_code: result?.exitCode?.toString(),
                    execution_time_ms: result?.executionTimeMs
                }
            );

            await publishExecutionResult(roomId, {
                submissionId,
                status,
                output: result?.output,
                error: result?.error,
                exitCode: result?.exitCode?.toString(),
                executionTimeMs: result?.executionTimeMs
            });

            return result;

        } catch (error) {

            await submissionRepository.updateSubmissionStatus(submissionId,'failed');

            await publishExecutionResult(roomId, {
                submissionId,
                status: 'failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            throw error;

        }


    },
    {
        concurrency: 10
    }
);

worker.on('completed', (job) => console.log(`--- Job ${job?.id} Completed ---`));
worker.on('failed', (job, err) => console.log(`--- Job ${job?.id} Failed --- ${err.message}`));

export default worker;