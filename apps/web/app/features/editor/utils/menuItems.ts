import { IoMicOffCircleOutline, IoMicCircleOutline } from "react-icons/io5";
import { TbCamera, TbCameraOff } from "react-icons/tb";
import { HiOutlineTerminal } from "react-icons/hi";
import { TfiWrite } from "react-icons/tfi";
import { RiChat1Line, RiIndeterminateCircleLine } from "react-icons/ri";

export const baseMenuItems = [
  { 
    id: 1, 
    label: 'Chat', 
    icon: RiChat1Line,
  },
  { 
    id: 2, 
    label: 'Mic', 
    icon: IoMicCircleOutline,
  },
  { 
    id: 3, 
    label: 'Terminal', 
    icon: HiOutlineTerminal,
  },
  { 
    id: 4, 
    label: 'Whiteboard', 
    icon: TfiWrite,
  },
  { 
    id: 5, 
    label: 'End Call', 
    icon: RiIndeterminateCircleLine,
  },
  { 
    id: 6, 
    label: 'Camera', 
    icon: TbCamera,
  }
];
