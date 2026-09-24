import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRoomStore } from "@/store/roomStore";
import CTAButton from "@/components/common/CTAButton";
import webSocketService from "@/lib/WebSocketService";
import Image from "next/image";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { AvatarGroup } from "./AvatarGroup";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/common/CopyButton";

interface RoomModalProps {
  websocketUrl: string;
  roomId: string;
}

const RoomModal = ({ roomId }: RoomModalProps) => {
  
  const { isStarted, isCreator, participants } = useRoomStore();

  const handleStart = () => {
    webSocketService.emit('room:start', { roomId: roomId });
  };

  const handleCancel = () => {
    webSocketService.emit('room:leave', { roomId: roomId });
    window.location.href = '/';
  };

  return (
    <Dialog open={!isStarted}>
      <DialogContent className="p-0 border-0 bg-transparent">
        <MovingBorderButton
          borderRadius="1rem"
          as="div"
          containerClassName="p-[1px]"
          duration={4000}
          className="w-full h-full"
        >
          <div className="relative w-full h-full bg-slate-900/90 backdrop-blur-xl p-6 rounded-[calc(1rem-1px)] 
          flex flex-col gap-4">
            <DialogHeader className="py-2">
              <DialogTitle className="text-white">
                WAITING ROOM
              </DialogTitle>
            </DialogHeader>

            <Field className="w-full flex flex-col gap-1">
              <FieldLabel htmlFor="invite-link" className="text-white">Invite Link</FieldLabel>
            

              <div className="w-full flex">
                <Input
                id="invite-link" 
                placeholder={"https://localhost:3000/room/" + roomId}
                className="text-white placeholder:text-gray-400 bg-background/50 border-gray-600 focus:border-white"
                readOnly
                />
                <CopyButton value={"https://localhost:3000/room/" + roomId} />
              </div>

              <FieldDescription className="text-gray-400">Share this link with your participants</FieldDescription>
            
            </Field>

            <AvatarGroup />

            <DialogFooter>
              <CTAButton 
                variant="secondary" 
                text="Cancel" 
                onClick={handleCancel}
              />
              {isCreator && (
                <CTAButton 
                  variant="primary" 
                  text="Start Room" 
                  onClick={handleStart}
                  disabled={!Array.isArray(participants) || participants.length < 2}
                />
              )}
            </DialogFooter>
          </div>
        </MovingBorderButton>
      </DialogContent>
    </Dialog>
  );
};

export default RoomModal;