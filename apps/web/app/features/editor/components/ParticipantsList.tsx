import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GearIcon } from "@/components/common/GearButton"

interface ParticipantListProps {
  participants: any[]
}

const ParticipantList = ({ participants }: ParticipantListProps) => {
    
    if (!participants || participants.length === 0) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <GearIcon size={32}/>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-full border-border bg-[#1e1e1e] h-full overflow-hidden" sideOffset={5} align='end'>
            
                <DropdownMenuGroup>

                    <DropdownMenuLabel className='p-2 border-b border-b-muted mb-2'>
                        Participants ({participants.length})
                    </DropdownMenuLabel>

                    <div 
                    className="max-h-[180px] overflow-y-auto flex flex-col gap-2
                    [&::-webkit-scrollbar]:w-1.5
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-muted-foreground/50
                    [&::-webkit-scrollbar-thumb]:h-2">
                
                    {
                        participants.map((participant) => (
                            <DropdownMenuItem key={participant.id} className="flex items-center gap-3 cursor-pointer bg-accent">

                                <Avatar 
                                className={`h-8 w-8 origin-center ring-2 ${
                                    (participant as any).role === 'creator' 
                                        ? 'ring-green-500' 
                                        : 'ring-background'
                                }`}
                                >
                                    <AvatarImage src={participant.profile_url || participant.profileImage} alt={participant.display_name || participant.displayName} />
                                    <AvatarFallback className="text-xs">
                                        {(participant.display_name || participant.displayName)?.charAt(0)?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                        
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-medium">{participant.display_name || participant.displayName}</span>
                                    <span className="text-muted-foreground text-xs font-normal">
                                        {participant.email ?? "Participant"} - {String((participant as any).role).charAt(0).toUpperCase() + String((participant as any).role).slice(1)}
                                    </span>
                                </div>

                            </DropdownMenuItem>
                        ))
                    }

                    </div>
                </DropdownMenuGroup>

            </DropdownMenuContent>

        </DropdownMenu>
    );
}

export default ParticipantList;

