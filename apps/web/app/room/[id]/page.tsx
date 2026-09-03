
interface RoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;
  console.log(id);
  return <></>;
}