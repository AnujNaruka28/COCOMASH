
interface ExecutionJobData {
    submissionId: string;
    roomId: string;
    userId: string;
    sourceCode: string;
    language: string;
    type: string;
}

interface ExecutionResult {
    submissionId: string;
    status: 'running' | 'completed' | 'failed';
    output?: string;
    error?: string;
    exitCode?: string;
    executionTimeMs?: number;
}

export type {
    ExecutionJobData,
    ExecutionResult
}