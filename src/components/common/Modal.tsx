interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function Modal({ isOpen, onClose, message }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="z-10 p-8 bg-white rounded-lg">
        <p className="mb-6 text-lg">{message}</p>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-green-800 bg-green-100 rounded hover:bg-green-200"
        >
          확인
        </button>
      </div>
    </div>
  );
}
