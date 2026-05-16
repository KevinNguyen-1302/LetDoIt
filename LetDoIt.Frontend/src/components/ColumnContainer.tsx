import type { Column } from "../services/columnService";

interface Props {
  column: Column;
}

const ColumnContainer = (props: Props) => {
  const { column } = props;
  return (
    <div className="h-88 bg-[#fffadf] rounded-lg w-64 border-2 border-black cursor-grab relative">
      <div className=" bg-amber-200 rounded-t-lg pb-6 py-2 px-4 border-b-2 border-black flex items-center gap-2">
        <div className="text-sm text-white bg-[#824900] w-fit px-2 py-1 rounded-full font-medium">
          0
        </div>
        <h3 className=" text-lg text-gray-800 ">{column.title}</h3>
      </div>
      
    </div>
  );
};

export default ColumnContainer;
