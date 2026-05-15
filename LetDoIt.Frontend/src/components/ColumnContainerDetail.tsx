import React from 'react'
import type { Column } from '../pages/Home';

interface Props {
  column: Column;
}

const ColumnContainerDetail = ({ column }: Props) => {
  return (
    <div className="p-4 bg-[#fffadf] rounded-lg w-full h-full">
        <div className="bg-amber-200 rounded-t-lg pb-6 py-2 px-4 border-b-2 border-black ">
            <h3 className=" text-lg text-gray-800 ">{column.title}</h3>
        </div>
        <div className="mt-4 p-4">
          <p className="text-gray-600">Column ID: {column.id}</p>
          {/* Add more content here */}
        </div>
    </div>
  )
}

export default ColumnContainerDetail