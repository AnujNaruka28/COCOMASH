"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import CTAButton from "@/components/common/CTAButton";
import { useCreateUser } from "@/features/users/services/userService";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";

interface RoomJoinModalProps {
  isOpen: boolean;
  onJoinSuccess: () => void;
}

export function RoomJoinModal({ isOpen, onJoinSuccess }: RoomJoinModalProps) {
  const [name, setName] = useState("");
  const { setUser } = useUserStore();
  const { mutate: createUser, isPending: isLoading } = useCreateUser();

  const handleJoin = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    createUser(name.trim(), {
      onSuccess: (userData) => {
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

        onJoinSuccess();
      }
    });
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Join Room</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Your Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="bg-slate-800 border-slate-600 text-white placeholder:text-gray-500"
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            /> 
          </div>

          <CTAButton
            text={isLoading ? "Joining..." : "Join Room"}
            onClick={handleJoin}
            disabled={isLoading || !name.trim()}
            className="w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RoomJoinModal;
