import React from 'react'
import { AlertTriangle, Check, X } from 'lucide-react'

interface DeleteCheckProps {
  projectTitle: string;
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteCheck: React.FC<DeleteCheckProps> = ({
  projectTitle,
  isOpen,
  isLoading,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full animate-in fade-in zoom-in-95">
        {/* Header with Warning Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-400 border-2 border-black rounded-lg p-2">
            <AlertTriangle className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="text-lg font-bold text-black">Delete Project</h3>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-700 mb-2">
          Are you sure you want to delete <span className="font-bold text-black">"{projectTitle}"</span>?
        </p>
        <p className="text-xs text-gray-500 mb-6">
          This action cannot be undone. All data associated with this project will be permanently removed.
        </p>

        {/* Divider */}
        <div className="border-t-2 border-black border-dashed mb-6"></div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border-2 border-black rounded-lg font-bold text-black bg-white hover:bg-gray-100 transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 flex items-center gap-2"
            title="Cancel Delete"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 border-2 border-black rounded-lg font-bold text-black bg-red-400 hover:bg-red-500 transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 flex items-center gap-2"
            title="Confirm Delete"
          >
            <Check className="w-4 h-4" strokeWidth={2.5} />
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteCheck