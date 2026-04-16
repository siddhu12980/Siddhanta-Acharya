"use client";

import { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Play } from "lucide-react";
import type {
  ArchNode as ArchNodeData,
  ArchEdge as ArchEdgeData,
  Simulation,
} from "@/lib/content";
import { ArchNode } from "@/components/architecture/arch-node";
import { ArchEdge } from "@/components/architecture/arch-edge";

const nodeTypes: NodeTypes = { archNode: ArchNode };
const edgeTypes: EdgeTypes = { archEdge: ArchEdge };

function buildNodes(archNodes: ArchNodeData[]): Node[] {
  return archNodes.map((n) => ({
    id: n.id,
    type: "archNode",
    position: { x: n.x, y: n.y },
    data: { label: n.label, sub: n.sub, nodeType: n.type, pulsing: false },
    draggable: false,
  }));
}

function buildEdges(archEdges: ArchEdgeData[]): Edge[] {
  return archEdges.map((e) => ({
    id: e.id,
    source: e.from,
    target: e.to,
    type: "archEdge",
    data: { label: e.label, animating: false },
  }));
}

// Color mapping for log sources
function getSourceColor(log: string): string {
  if (log.includes("[client]")) return "text-app-node-external";
  if (log.includes("[master]")) return "text-app-node-service";
  if (log.includes("[redis]")) return "text-app-node-datastore";
  if (log.includes("[worker]")) return "text-app-node-service";
  return "text-app-text-muted";
}

interface DemoTabProps {
  nodes: ArchNodeData[];
  edges: ArchEdgeData[];
  simulation: Simulation;
}

export function DemoTab({ nodes: archNodes, edges: archEdges, simulation }: DemoTabProps) {
  const [nodes, setNodes] = useNodesState(buildNodes(archNodes));
  const [edges, setEdges] = useEdgesState(buildEdges(archEdges));
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const counterRef = useRef(4812);
  const logEndRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const pulseNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, pulsing: true } }
            : n,
        ),
      );
      const t = setTimeout(() => {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === nodeId
              ? { ...n, data: { ...n.data, pulsing: false } }
              : n,
          ),
        );
      }, 600);
      timersRef.current.push(t);
    },
    [setNodes],
  );

  const animateEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) =>
        eds.map((e) =>
          e.id === edgeId
            ? { ...e, data: { ...e.data, animating: true } }
            : e,
        ),
      );
      const t = setTimeout(() => {
        setEdges((eds) =>
          eds.map((e) =>
            e.id === edgeId
              ? { ...e, data: { ...e.data, animating: false } }
              : e,
          ),
        );
      }, 1000);
      timersRef.current.push(t);
    },
    [setEdges],
  );

  const runDemo = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);

    const id = `${simulation.counterPrefix}-${counterRef.current++}`;

    setLogs([]);
    setNodes(buildNodes(archNodes));
    setEdges(buildEdges(archEdges));

    simulation.steps.forEach((step) => {
      const t = setTimeout(() => {
        // Replace {id} placeholder in log messages
        const log = step.log.replace(/\{id\}/g, id);
        setLogs((prev) => [...prev, log]);

        if (step.pulseNode) {
          pulseNode(step.pulseNode);
        }

        if (step.edgeId) {
          animateEdge(step.edgeId);
        }

        requestAnimationFrame(() => {
          logEndRef.current?.scrollIntoView({ behavior: "smooth" });
        });
      }, step.delay);
      timersRef.current.push(t);
    });

    const t = setTimeout(() => {
      setIsRunning(false);
    }, simulation.totalDuration);
    timersRef.current.push(t);
  }, [isRunning, pulseNode, animateEdge, setNodes, setEdges, archNodes, archEdges, simulation]);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
      {/* Controls + Log */}
      <div className="flex w-full flex-col gap-4 lg:w-[40%]">
        <button
          onClick={runDemo}
          disabled={isRunning}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-app-solid px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-app-solid-text transition-colors hover:bg-app-accent disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Play className="size-3" />
          {isRunning ? "Running..." : simulation.buttonLabel}
        </button>

        {/* Log viewer */}
        <div className="h-[240px] sm:h-[300px] lg:h-[340px] overflow-y-auto rounded-sm border border-app-border bg-app-panel p-3">
          {logs.length === 0 ? (
            <p className="font-mono text-xs text-app-text-muted">
              Click &quot;{simulation.buttonLabel}&quot; to start the demo sequence.
            </p>
          ) : (
            <div className="space-y-1">
              {logs.map((log, i) => (
                <p
                  key={i}
                  className={`font-mono text-[11px] leading-relaxed break-all sm:break-normal ${getSourceColor(log)}`}
                >
                  {log}
                </p>
              ))}
              <div ref={logEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Mini architecture diagram */}
      <div className="h-[300px] sm:h-[360px] lg:h-auto w-full rounded-sm border border-app-border bg-app-panel lg:flex-1 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
        >
          <Background gap={40} size={1} color="var(--app-border)" />
        </ReactFlow>
      </div>
    </div>
  );
}
