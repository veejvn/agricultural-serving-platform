"use client";

import React, { useContext } from "react";
import { FormContext } from "./index";
import { SubmitButtonProps } from "@/types/form";

const SubmitButton = ({ children, loadingText }: SubmitButtonProps) => {
  const { loading } = useContext(FormContext);
  return (
    <button
      type="submit"
      className={`w-full py-3 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] animate-bounce" ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={loading}
    >
      {loading ? loadingText || "Đang xử lý..." : children}
    </button>
  );
};

export default SubmitButton;
