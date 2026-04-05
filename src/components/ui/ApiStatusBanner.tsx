"use client";

import { useTasks } from "@/hooks/useTasks";
import { AlertTriangle } from "lucide-react";

export function ApiStatusBanner() {
  const { isError } = useTasks();

  if (!isError) return null;

  return (
    <div className="api-banner">
      <AlertTriangle size={16} />
      <span>
        <strong>API not available.</strong> Make sure json-server is running:{" "}
        <code>npm run mock-api</code>
      </span>
    </div>
  );
}
