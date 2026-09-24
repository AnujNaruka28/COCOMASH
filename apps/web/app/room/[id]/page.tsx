
import Room from "@/features/rooms/components/Room";

interface RoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;

  return <Room roomId={id} />;
}
