import type { Column } from "../services/columnService";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  column: Column;
}

const ColumnContainer = (props: Props) => {
  const { column } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.columnId,
    data: {
      type: "column",
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return(
      <div ref={setNodeRef}
      style={style}
      className="h-88 bg-[#c6c6c6] rounded-lg w-64 opacity-50 ">
      </div>)
  }

  

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="h-88 bg-[#fffadf] rounded-lg w-64 border-2 border-black cursor-grab relative "
    >
      <div
        {...attributes}
        {...listeners}
        className=" bg-amber-200 rounded-t-lg pb-6 py-2 px-4 border-b-2 border-black flex items-center gap-2"
      >
        <div className="text-sm text-white bg-[#824900] w-fit px-2 py-1 rounded-full font-medium">
          0
        </div>
        <h3 className=" text-lg text-gray-800 ">{column.title}</h3>
      </div>
    </div>
  );
};

export default ColumnContainer;
