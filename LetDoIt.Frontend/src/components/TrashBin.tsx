import { useDroppable } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";

interface TrashBinProps {
  isActive: boolean;
}

const TrashBin = ({ isActive }: TrashBinProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "trash-bin",
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-2 bg-white border-2 border-black rounded-lg transition-all shadow-sm font-medium w-64 justify-center shrink-0 cursor-pointer ${
        isOver
          ? "scale-115 bg-red-200 border-red-500 text-red-500 shadow-lg m-4 "
          : "text-gray-400 hover:text-red-500 hover:bg-gray-200"
      } ${isActive ? "opacity-50" : ""}`}
    >
      <Trash2 size={24} />
      <span className="text-sm">{isOver ? "Drop to delete" : "Drag here to delete"}</span>
    </div>
  );
};

export default TrashBin;
