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
import { Skeleton } from "@/components/ui/skeleton";

export function AvatarGroup({participants}: {participants: any[]}) {

  const visibleParticipants = participants?.slice(0, 4) || [];
  const remainingCount = Math.max(
    participants?.length - visibleParticipants.length || 0,
    0
  );

  if(!Array.isArray(participants) || participants.length === 0) {

    return (
      <div className="group/avatars flex items-center px-2 py-4">
        {
          Array.from({length : 4}).map((_, idx) => (
            <div
            key={`skeleton-${idx}`}
            style={{
              "--index" : idx,
              zIndex :  4 - idx
            } as React.CSSProperties}
            className="group/avatar-item translate-x-[calc(var(--index)*-8px)]"
            >
              <Skeleton className="w-10 h-10 rounded-full bg-slate-700"/>
            </div>
          ))
        }
        
      </div>
    )
  }
  
  return (
    <div className="group/avatars flex items-center px-2 py-4">
      {
        visibleParticipants.map((participant,idx) => (
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
                  "origin-center ring-2 transition-transform duration-300 ease-in-out",
                  (participant as any).role === 'creator' ? "ring-green-500" : "ring-background",
                  "group-hover/avatar-item:scale-110"
                )}
              >
                <AvatarImage src={participant.profileImage} alt={participant.displayName} />
                <AvatarFallback className="text-xs">
                  {participant.displayName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent sideOffset={10}>{participant.displayName} - {String((participant as any).role).charAt(0).toUpperCase() + String((participant as any).role).slice(1)}</TooltipContent>
          </Tooltip>
          </div>
        ))
      }
      {remainingCount > 0 && (
        <div
        className="group/avatar-item translate-x-[calc(var(--index)*-8px)]"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="ring-background origin-center ring-2 transition-transform duration-300 ease-in-out group-hover/avatar-item:scale-110">
                <AvatarFallback className="text-xs bg-white">
                  +{remainingCount}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent sideOffset={10}>
              {remainingCount} more participants
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
