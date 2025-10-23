"use client";

import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseClass =
    "shadow-lg fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-auto px-4 py-3 rounded-lg";
  const typeClass =
    type === "success"
      ? "bg-base-100 border border-green-500 text-green-700"
      : "bg-base-100 border border-red-500 text-red-700";

  return (
    <div className={`${baseClass} ${typeClass}`}>
      <span className="font-medium">{message}</span>
    </div>
  );
}
