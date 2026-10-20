import { prisma } from "../src/client.js";

type StatusType = 'running' | 'completed' | 'failed' ;

class SubmissionRepository {

    async createSubmission(data: any) {
        // Find the participant record for this user in this room
        const participant = await prisma.roomParticipant.findFirst({
            where: {
                room_id: data.roomId,
                user_id: data.userId
            }
        });

        if (!participant) {
            throw new Error('User is not a participant in this room');
        }

        const submissionData: any = {
            source_code: data.sourceCode,
            language: data.language,
            status: "pending",
            room: {
                connect: { id: data.roomId }
            },
            participant: {
                connect: { id: participant.id }
            }
        };

        // Only connect exercise if exerciseId is provided
        if (data.exerciseId) {
            submissionData.exercise = {
                connect: { id: data.exerciseId }
            };
        }

        return await prisma.submission.create({
            data: submissionData
        });
    }

    async getSubmissionById(submissionId: string) {
        return await prisma.submission.findUnique({
            where: {
                id: submissionId
            },
            include: {
                test_results: true
            }
        });
    }

    async updateSubmissionStatus(
        submissionId: string, 
        status: StatusType,
        result?: {
            output?: string;
            error?: string;
            exit_code?: string;
            execution_time_ms?: number;
        }
    ) {

        let data: any = { status: status };

        if(status === 'completed') data = { ...data , submitted_at : new Date() } ;

        if(result) data = { ...data , ...result } ;

        await prisma.submission.update({
            where: { id: submissionId },
            data
        })

    }
}

const submissionRepository = new SubmissionRepository();
export default submissionRepository;
