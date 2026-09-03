export interface IRoomCreateFormValue {
  name?: string;
  max_participants?: number;
  room_type?: "normal" | "private";
  display_name: string;
}