import { create } from 'zustand';

interface Participant {
  id: string;
  displayName: string;
  profileImage?: string;
  role: 'creator' | 'joiner';
}

interface RoomDetails {
  id: string;
  name: string | null;
  room_type: 'normal' | 'playground';
  status: 'waiting' | 'active' | 'ended' | 'expired';
  max_participants: number;
  creator_id: string;
  created_at: Date;
  expires_at: Date;
  participant_count: number;
}

interface RoomStore {
  websocketUrl: string | null;
  
  isCreator: boolean;
  isStarted: boolean;
  isLoading: boolean;
  error: string | null;
  
  roomDetails: RoomDetails | null;
  
  participants: Participant[];
  
  setWebSocketUrl: (url: string) => void;
  setCreator: (isCreator: boolean) => void;
  setStarted: (started: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setRoomDetails: (details: RoomDetails) => void;
  setParticipants: (participants: Participant[]) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (participantId: string) => void;
  reset: () => void;
}

export const useRoomStore = create<RoomStore>((set) => ({

  websocketUrl: null,
  isCreator: false,
  isStarted: false,
  isLoading: false,
  error: null,
  roomDetails: null,
  participants: [],
  
  setWebSocketUrl: (websocketUrl) => set({ websocketUrl }),
  setCreator: (isCreator) => set({ isCreator }),
  setStarted: (isStarted) => set({ isStarted }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setRoomDetails: (roomDetails) => set({ roomDetails }),
  setParticipants: (participants) => set({ participants }),
  
  addParticipant: (participant) => set((state) => {
    const exists = state.participants.some(p => p.id === participant.id);
    if (exists) return state;
    return {
      participants: [...state.participants, participant]
    };
  }),
  
  removeParticipant: (participantId) => set((state) => ({
    participants: state.participants.filter(p => p.id !== participantId)
  })),
  
  reset: () => set({
    websocketUrl: null,
    isCreator: false,
    isStarted: false,
    isLoading: false,
    error: null,
    roomDetails: null,
    participants: [],
  }),
}));