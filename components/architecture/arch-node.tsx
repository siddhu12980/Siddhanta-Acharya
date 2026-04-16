"use client";

import { memo, useEffect, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";

const typeColors: Record<string, string> = {
  service: "border-app-node-service",
  datastore: "border-app-node-datastore",
  external: "border-app-node-external",
};

const typeBgPulse: Record<string, string> = {
  service: "shadow-[0_0_12px_4px_var(--app-node-service)]",
  datastore: "shadow-[0_0_12px_4px_var(--app-node-datastore)]",
  external: "shadow-[0_0_12px_4px_var(--app-node-external)]",
};

interface ArchNodeData {
  label: string;
  sub?: string;
  nodeType: string;
  pulsing?: boolean;
  [key: string]: unknown;
}

export const ArchNode = memo(function ArchNode({
  data,
}: NodeProps & { data: ArchNodeData }) {
  const { label, sub, nodeType, pulsing } = data;

  return (
    <div
      className={cn(
        "relative rounded-sm border bg-app-panel px-4 py-2.5 transition-all duration-200",
        typeColors[nodeType] || "border-app-border",
        pulsing && "animate-node-pulse",
        pulsing && typeBgPulse[nodeType],
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-app-border !border-none !size-0"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-app-border !border-none !size-0"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!bg-app-border !border-none !size-0"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!bg-app-border !border-none !size-0"
      />

      <p className="font-mono text-xs uppercase tracking-widest text-app-text">
        {label}
      </p>
      {sub && (
        <p className="mt-0.5 font-mono text-[10px] text-app-text-muted">
          {sub}
        </p>
      )}
    </div>
  );
});
