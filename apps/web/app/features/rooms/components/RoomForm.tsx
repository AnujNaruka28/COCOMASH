"use client"

import { Controller, useForm } from "react-hook-form";
import { IRoomCreateFormValue } from "@/types/room/IRoomCreateFormValue";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import NumberSlider from "@/components/common/NumberSlider";
import { motion } from "motion/react";
import CTAButton from "@/components/common/CTAButton";
import { useCreateRoom } from "../services/roomService";
import { useRoomStore } from "store/roomStore";
import Loading from "loading";

export default function RoomForm() {

  const {handleSubmit, register, control, formState: {errors}} = useForm<IRoomCreateFormValue>({
    defaultValues: {
      name: "",
      max_participants: 4,
      room_type: "normal",
      display_name: "",
    }
  });

  const { isLoading } = useRoomStore(); 

  const {mutate: createRoom} = useCreateRoom();

  const roomCreateFn = (data: IRoomCreateFormValue) => createRoom(data);

  return (
    <div className="flex items-center justify-center p-12 h-full">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <form
          method="post"
          onSubmit={handleSubmit(roomCreateFn)}
          className="p-8 bg-card rounded-lg shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] flex flex-col items-center gap-6"
        >

          <header className="text-2xl font-bold text-white">
             CREATE ROOM
          </header>

          <Field className="w-full">
            <FieldLabel htmlFor="name" className="text-white">Room Name</FieldLabel>

            <Input 
              id="name" 
              placeholder="Enter room name"
              className="text-white placeholder:text-gray-400 bg-background/50 border-gray-600 focus:border-white"
              {...register("name")}
            />

            <FieldDescription className="text-gray-400">Enter a name for your room</FieldDescription>

          </Field>

          <Field className="w-full">
            <FieldLabel htmlFor="max_participants" className="text-white">Max Participants</FieldLabel>
            <Controller
              name="max_participants"
              control={control}
              render={({field}) => (
                <NumberSlider
                  value={[field.value || 4]}
                  onChange={(value) => field.onChange(value[0])}
                  minimum={2}
                  maximum={10}
                />
              )}
            />
            <FieldDescription className="text-gray-400">Select maximum number of participants (2-10)</FieldDescription>
          </Field>

          <Field className="w-full">
            <FieldLabel htmlFor="display_name" className="text-white">Your Name</FieldLabel>
            <Input 
              id="display_name" 
              placeholder="Enter your name"
              className={`text-white placeholder:text-gray-400 bg-background/50 focus:border-white ${
                errors.display_name ? 'border-destructive focus:border-destructive' : 'border-gray-600'
              }`}
              {...register("display_name", {
                required: "Display name is required",
                minLength: {
                  value: 1,
                  message: "Display name must be at least 1 character long",
                },
                maxLength: {
                  value: 50,
                  message: "Display name must be at most 50 characters long",
                },
              })}
            />
            {errors.display_name && (
              <p className="text-destructive text-sm mt-1">{errors.display_name.message}</p>
            )}
            <FieldDescription className="text-gray-400">Enter your name to join the room</FieldDescription>
          </Field>
          
          <CTAButton 
          variant="primary" 
          type="submit" 
          disabled={isLoading}
          children={isLoading ? <Loading /> : "Create Room"}
          />

        </form>
      </motion.div>
    </div>
  );
}

