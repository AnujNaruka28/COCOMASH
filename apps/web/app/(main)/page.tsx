import { ScalesContainer } from "@/components/ui/scales";
import RoomForm from "@/features/rooms/components/RoomForm";

export default function Home() {
  return (
    <section className="flex-1 h-full relative">
      <ScalesContainer size={8} orientation="diagonal" className="absolute inset-0">
        <RoomForm />
      </ScalesContainer>
    </section>
  );
}
