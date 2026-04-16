"use client";

import { useState, useEffect } from "react";
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
import { motion } from "framer-motion";
import type { ArchNode as ArchNodeData, ArchEdge as ArchEdgeData } from "@/lib/content";
import { ArchNode } from "./arch-node";
import { ArchEdge } from "./arch-edge";

const nodeTypes: NodeTypes = {
  archNode: ArchNode,
};

const edgeTypes: EdgeTypes = {
  archEdge: ArchEdge,
};

function buildNodes(archNodes: ArchNodeData[]): Node[] {
  return archNodes.map((n) => ({
    id: n.id,
    type: "archNode",
    position: { x: n.x, y: n.y },
    data: {
      label: n.label,
      sub: n.sub,
      nodeType: n.type,
    },
    draggable: false,
  }));
}

function buildEdges(archEdges: ArchEdgeData[]): Edge[] {
  return archEdges.map((e) => ({
    id: e.id,
    source: e.from,
    target: e.to,
    type: "archEdge",
    data: { label: e.label },
  }));
}

interface ArchitectureTabProps {
  nodes: ArchNodeData[];
  edges: ArchEdgeData[];
}

export function ArchitectureTab({ nodes: archNodes, edges: archEdges }: ArchitectureTabProps) {
  const [nodes] = useNodesState(buildNodes(archNodes));
  const [edges] = useEdgesState(buildEdges(archEdges));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="h-[320px] sm:h-[400px] lg:h-[460px] w-full rounded-sm border border-app-border bg-app-panel overflow-hidden"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        panOnDrag={isMobile}
        zoomOnScroll={false}
        zoomOnPinch={isMobile}
        zoomOnDoubleClick={false}
        preventScrolling={!isMobile}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background gap={40} size={1} color="var(--app-border)" />
      </ReactFlow>
    </motion.div>
  );
}
