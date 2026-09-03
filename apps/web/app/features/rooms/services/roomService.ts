import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosAPIService } from "@/lib/APIService";
import { IRoomCreateFormValue } from "@/types/room";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRoomStore } from "@/store/roomStore";

const useCreateRoom = () => {
    const router = useRouter();
    const { setLoading, setWebSocketUrl, setCreator, setRoomDetails } = useRoomStore();
    
    return useMutation({
        mutationFn: (data: IRoomCreateFormValue) => AxiosAPIService('/rooms', 'POST', data),
        onMutate: () => setLoading(true),
        onSuccess: (response) => {
            toast.success("Room created successfully");
            
            setWebSocketUrl(response.data.data?.websocket_url || '');
            setCreator(true);
            setRoomDetails(response.data.data?.room);
            
            router.push(`/room/${response.data.data?.room?.id}`);
        },
        onError: (error) => {
            console.log(error);
            toast.error("Failed to create room");
        },
        onSettled: () => setLoading(false)
    })
};

const useGetRoom = (roomId: string) => {
    return useQuery({
        queryKey: ["room", roomId],
        queryFn: () => AxiosAPIService(`/rooms/${roomId}`, "GET"),
        enabled: !!roomId,
    })
};

export {
    useCreateRoom,
    useGetRoom,
}