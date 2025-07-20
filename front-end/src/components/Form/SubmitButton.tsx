"use client";

import React, { useContext } from "react";
import { FormContext } from "./index";
import { SubmitButtonProps } from "@/types/form";

const SubmitButton = ({ children, loadingText }: SubmitButtonProps) => {
  const { loading } = useContext(FormContext);
  return (
    <button
      type="submit"
      className={`w-full py-3 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-700 hover:to-green-900 dark:from-green-700 dark:to-green-900 dark:hover:from-green-500 dark:hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]" ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={loading}
    >
      {loading ? loadingText || "Đang xử lý..." : children}
    </button>
  );
};

export default SubmitButton;
