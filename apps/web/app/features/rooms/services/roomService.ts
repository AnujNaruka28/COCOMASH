import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosAPIService } from "@/lib/APIService";
import { IRoomCreateFormValue } from "@/types/room";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRoomStore } from "@/store/roomStore";
import { useUserStore } from "@/store/userStore";

const useCreateRoom = () => {
    const router = useRouter();
    const { setLoading, setWebSocketUrl, setCreator, setRoomDetails } = useRoomStore();
    const { setUser } = useUserStore();
    
    return useMutation({
        mutationFn: (data: IRoomCreateFormValue) => AxiosAPIService('/rooms', 'POST', data),
        onMutate: () => setLoading(true),
        onSuccess: (response) => {
            toast.success("Room created successfully");

            const wsBaseUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL!;
            setWebSocketUrl(wsBaseUrl);
            setCreator(true);
            setRoomDetails(response.data.data?.room);
            console.log(response.data.data);
            
            // Store user data if returned
            if (response.data.data?.user) {
                const userData = response.data.data.user;
                setUser({
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    profile_url: userData.profile_url
                });
                const storage = process.env.NODE_ENV === 'development' ? sessionStorage : localStorage;

                storage.setItem('userId', userData.id);
                storage.setItem('userName', userData.name);
                storage.setItem('profileImage', userData.profile_url || '');
            }
            
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