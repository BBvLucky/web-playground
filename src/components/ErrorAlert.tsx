"use client";

import React from "react";

interface ErrorAlertProps {
  message: string | null;
}

export const errorAlert = (props: ErrorAlertProps): React.JSX.Element => {
  const { message } = props;
  
  if (!message) return null as unknown as React.JSX.Element;

  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Ошибка</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default errorAlert;