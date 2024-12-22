"use client";

import { useCallback, useState, type ChangeEventHandler } from "react";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  MiniMap,
  Background,
  Controls,
  Panel,
  Position,
  type Node,
  type Edge,
  type ColorMode,
  type OnConnect,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

const initialNodes: Node[] = [
  {
    id: "A",
    type: "input",
    position: { x: 0, y: 150 },
    data: { label: "A" },
    ...nodeDefaults,
  },
  {
    id: "B",
    position: { x: 250, y: 0 },
    data: { label: "B" },
    ...nodeDefaults,
  },
  {
    id: "C",
    position: { x: 250, y: 150 },
    data: { label: "C" },
    ...nodeDefaults,
  },
  {
    id: "D",
    position: { x: 250, y: 300 },
    data: { label: "D" },
    ...nodeDefaults,
  },
];

const initialEdges: Edge[] = [
  {
    id: "A-B",
    source: "A",
    target: "B",
  },
  {
    id: "A-C",
    source: "A",
    target: "C",
  },
  {
    id: "A-D",
    source: "A",
    target: "D",
  },
];

const ColorModeFlow = () => {
  const [colorMode, setColorMode] = useState<ColorMode>("dark");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [newNodeName, setNewNodeName] = useState<string>("");

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onChangeColorMode: ChangeEventHandler<HTMLSelectElement> = (evt) => {
    setColorMode(evt.target.value as ColorMode);
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setNewNodeName(evt.target.value);
  };

  const handleAddNode = () => {
    if (!newNodeName.trim()) return;

    const newNodeId = newNodeName;
    const newNode: Node = {
      id: newNodeId,
      position: { x: 500, y: 150 + nodes.length * 50 }, // Position nodes dynamically
      data: { label: newNodeName },
      ...nodeDefaults,
    };

    // const newEdge: Edge = {
    //   id: `B-${newNodeId}`,
    //   source: "A", // Connect to node 'A' by default
    //   target: newNodeId,
    // };

    setNodes((nds) => [...nds, newNode]);
    // setEdges((eds) => [...eds, newEdge]);
    setNewNodeName(""); // Reset input field
  };

  return (
    <div className="w-full h-96">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode={colorMode}
        fitView
        className="w-full h-96"
      >
        <MiniMap />
        <Background className="w-full h-96" />
        <Controls />

        <Panel position="top-right">
          <select onChange={onChangeColorMode} data-testid="colormode-select">
            <option value="dark">dark</option>
            <option value="light">light</option>
            <option value="system">system</option>
          </select>
        </Panel>
      </ReactFlow>
      <div className="mt-4 flex items-center gap-2">
        <Input
          type="text"
          placeholder="Enter node name"
          value={newNodeName}
          onChange={handleInputChange}
          className="border rounded px-2 py-1"
        />
        <Button
          onClick={handleAddNode}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Add Node
        </Button>
      </div>
    </div>
  );
};

export default ColorModeFlow;
