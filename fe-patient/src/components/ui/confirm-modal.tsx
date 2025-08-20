import React from "react";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm transition-opacity duration-200">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm transform transition-all duration-200 scale-100 opacity-100 animate-modal-pop border border-gray-200">
  <div className="flex flex-col items-center">
          <svg className="w-12 h-12 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
          <h2 className="text-xl font-bold mb-2 text-center">{title}</h2>
          <p className="text-sm text-gray-600 mb-4 text-center">{description}</p>
          <div className="flex gap-2 w-full">
            <button
              className="flex-1 py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              className="flex-1 py-2 px-4 rounded bg-red-500 hover:bg-red-600 text-white font-semibold"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Deleting..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
