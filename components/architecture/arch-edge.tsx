"use client";

import { memo, useState, useCallback, useEffect, useRef } from "react";
import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
  EdgeLabelRenderer,
} from "@xyflow/react";

interface ArchEdgeData {
  label?: string;
  animating?: boolean;
  [key: string]: unknown;
}

export const ArchEdge = memo(function ArchEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
}: EdgeProps & { data?: ArchEdgeData }) {
  const [isHovered, setIsHovered] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(500);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [edgePath]);

  const showDot = isHovered || data?.animating;

  return (
    <>
      {/* Invisible wider hit area for hover */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="cursor-pointer"
      />

      {/* Visible edge */}
      <path
        ref={pathRef}
        d={edgePath}
        fill="none"
        stroke={
          showDot
            ? "var(--app-accent)"
            : "var(--app-border)"
        }
        strokeWidth={showDot ? 2 : 1.5}
        className="transition-all duration-200"
        style={{
          strokeDasharray: pathLength,
          strokeDashoffset: 0,
          animation: "none",
        }}
      />

      {/* Traveling dot */}
      {showDot && (
        <circle
          r={3}
          fill="var(--app-accent)"
          className="animate-travel-dot"
        >
          <animateMotion
            dur="1s"
            repeatCount={data?.animating ? "1" : "indefinite"}
            path={edgePath}
          />
        </circle>
      )}

      {/* Label */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan absolute rounded-sm bg-app-panel px-1.5 py-0.5 font-mono text-[10px] text-app-text-muted border border-app-border"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "none",
            }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});
