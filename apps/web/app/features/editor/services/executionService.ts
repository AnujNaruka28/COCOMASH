import { useMutation } from "@tanstack/react-query";
import { AxiosAPIService } from "@/lib/APIService";
import { toast } from "sonner";

interface ExecuteCodeRequest {
  roomId: string;
  userId: string;
  sourceCode: string;
  language: string;
  type: 'run' | 'submit';
}

interface ExecuteCodeResponse {
  submissionId: string;
  status: string;
  message: string;
}

const useExecuteCode = () => {
  return useMutation({
    mutationFn: (data: ExecuteCodeRequest) => 
      AxiosAPIService('/submissions/execute', 'POST', data),
    onSuccess: (response: { data : ExecuteCodeResponse }) => {
      console.log('Execution queued:', response.data.submissionId);
      toast.success('Code execution started');
    },
    onError: (error) => {
      console.error('Failed to queue execution:', error);
      toast.error('Failed to execute code');
    },
  });
};

export { useExecuteCode };
