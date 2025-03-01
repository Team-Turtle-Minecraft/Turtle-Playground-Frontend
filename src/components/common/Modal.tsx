import { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function Modal({ isOpen, onClose, message }: ModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      // 닫힐 때 애니메이션 효과를 위해 지연 적용
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // 애니메이션 시간
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${isOpen ? "opacity-50" : "opacity-0"}`}
        onClick={onClose}
      ></div>
      <div
        className={`z-10 p-8 bg-white rounded-lg shadow-lg transform transition-all duration-300 ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        <p className="mb-6 text-lg">{message}</p>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-green-800 bg-green-100 rounded hover:bg-green-200 transition duration-200"
        >
          확인
        </button>
      </div>
    </div>
  );
}
