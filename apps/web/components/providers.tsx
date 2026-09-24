"use client"

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "./ui/tooltip";

const queryClient = new QueryClient();

export function Providers({children} : {children: ReactNode}) {

    return (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            {children}
            <Toaster />
        </TooltipProvider>
    </QueryClientProvider>
    )
}