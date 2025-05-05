import React from "react";
export default function Input({ className = "", ...props }) {
    return (
      <input
        className={`px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
        {...props}
      />
    );
  }
  