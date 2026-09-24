import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRoomStore } from "@/store/roomStore";
import { Skeleton } from "@/components/ui/skeleton";

export function AvatarGroup() {

  const {participants} = useRoomStore();
  return (
    <div className="group/avatars flex items-center px-2 py-4">
      {Array.isArray(participants) && participants.length > 0 ? participants.map((participant,idx) => (
        <div
          key={`${participant.id}-${idx}`}
          style={
            {
              "--index": idx,
              zIndex: participants.length - idx,
            } as React.CSSProperties
          }
          className="group/avatar-item translate-x-[calc(var(--index)*-8px)] transition-all duration-300 ease-in-out will-change-transform group-hover/avatars:translate-x-[calc(var(--index)*6px)]"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar
                className={cn(
                  "ring-background origin-center ring-2 transition-transform duration-300 ease-in-out",
                  "group-hover/avatar-item:scale-110"
                )}
              >
                <AvatarImage src={participant.profileImage} alt={participant.displayName} />
                <AvatarFallback className="text-xs">
                  {participant.displayName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent sideOffset={10}>{participant.displayName}</TooltipContent>
          </Tooltip>
        </div>
      )) : (
        Array(3).fill(null).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            style={
              {
                "--index": index,
                zIndex: 3 - index,
              } as React.CSSProperties
            }
            className="group/avatar-item translate-x-[calc(var(--index)*-8px)]"
          >
            <Skeleton className="w-10 h-10 bg-slate-700 rounded-full" />
          </div>
        ))
      )}
    </div>
  );
}
