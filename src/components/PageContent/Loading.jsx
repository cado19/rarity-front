import React from "react";
import { Mosaic } from "react-loading-indicators";

export default function Loading() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-center h-full">
      <Mosaic color="#32cd32" size="large" text="Loading..." textColor="" />
    </div>
  );
}
