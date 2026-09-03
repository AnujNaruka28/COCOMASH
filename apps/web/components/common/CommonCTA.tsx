"use client";

import { motion } from "motion/react";
import Silk from "../ui/Silk";

export default function CommonCTA() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="p-0 h-full relative">
      <Silk  
        speed={2.5}
        scale={1}
        color="#e47833"
        noiseIntensity={0.7}
        rotation={0}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white">COCOMASH</h1>
        <p className="text-white">Code, Collab, Compete</p>
      </div>
    </motion.div>
  );
}
