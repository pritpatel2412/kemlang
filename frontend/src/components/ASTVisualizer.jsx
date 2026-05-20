import React, { useState } from "react";
import { GitBranch, CornerDownRight, Play, CheckCircle2, ChevronDown, ChevronRight } from "lucide-react";

export default function ASTVisualizer({ ast, activeNodeId }) {
  const [collapsedNodes, setCollapsedNodes] = useState({});

  const toggleCollapse = (id) => {
    setCollapsedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!ast || ast.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-dark-elevated/40 border border-hairline/10 rounded-lg h-full select-none">
        <GitBranch className="w-10 h-10 text-muted-soft mb-3 stroke-[1.5]" />
        <h4 className="font-serif-editorial font-medium text-[#faf9f5] text-sm">No Compiled Code</h4>
        <p className="text-[11px] text-muted-soft mt-1 max-w-[220px] leading-relaxed">
          Write some code in the editor and click either "Run" or "Debug" to compile and visualize its syntax tree.
        </p>
      </div>
    );
  }

  // Recursive AST Node Renderer
  const renderASTNode = (node, depth = 0) => {
    if (!node) return null;

    // Handles arrays (blocks of statements)
    if (Array.isArray(node)) {
      return (
        <div className="space-y-3 pl-4 border-l border-hairline/10 ml-2 mt-2">
          {node.map((subNode) => (
            <div key={subNode.id} className="relative">
              {/* Connecting left line node line indicator */}
              <div className="absolute -left-4 top-4 w-4 h-[1px] bg-hairline/10" />
              {renderASTNode(subNode, depth + 1)}
            </div>
          ))}
        </div>
      );
    }

    const isActive = activeNodeId === node.id;
    const isCollapsed = collapsedNodes[node.id];

    // Style tokens depending on AST Node Type
    let badgeText = node.type;
    let badgeColor = "bg-primary/10 text-primary border-primary/20";
    let nodeDetails = "";

    switch (node.type) {
      case "ASSIGN":
        badgeText = "do Assignment";
        badgeColor = "bg-accent-teal/10 text-accent-teal border-accent-teal/20";
        nodeDetails = `var: "${node.varName}"`;
        break;
      case "PRINT":
        badgeText = "lakho Print";
        badgeColor = "bg-accent-teal/10 text-accent-teal border-accent-teal/20";
        break;
      case "INPUT":
        badgeText = "jaano Input";
        badgeColor = "bg-accent-amber/10 text-accent-amber border-accent-amber/20";
        nodeDetails = `var: "${node.varName}"`;
        break;
      case "IF":
        badgeText = "jo Conditional";
        badgeColor = "bg-primary/15 text-primary border-primary/20";
        break;
      case "WHILE":
        badgeText = "jyaare Loop";
        badgeColor = "bg-primary/15 text-primary border-primary/20";
        break;
      case "BIN_OP":
        badgeText = `Operator "${node.op}"`;
        badgeColor = "bg-accent-amber/10 text-accent-amber border-accent-amber/20 font-mono";
        break;
      case "VAR":
        badgeText = "Variable Ref";
        badgeColor = "bg-neutral-400/10 text-muted-soft border-neutral-400/20";
        nodeDetails = `name: "${node.varName}"`;
        break;
      case "LITERAL":
        badgeText = typeof node.value === "string" ? "String Literal" : typeof node.value === "boolean" ? "Boolean Literal" : "Number Literal";
        badgeColor = "bg-green-400/10 text-success border-green-400/25";
        nodeDetails = `val: ${String(node.value)}`;
        break;
      case "CONDITION":
        badgeText = "Condition Check";
        badgeColor = "bg-accent-amber/15 text-accent-amber border-accent-amber/25";
        break;
      default:
        break;
    }

    return (
      <div 
        className={`rounded-md border p-3 transition-all relative ${
          isActive 
            ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(204,120,92,0.15)] ring-1 ring-primary scale-[1.01] z-10" 
            : "bg-surface-dark border-hairline/10 hover:border-hairline/25"
        }`}
      >
        {/* Active Node Pulsing Badge */}
        {isActive && (
          <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-primary text-[#faf9f5] text-[8px] font-extrabold uppercase tracking-widest animate-pulse shadow-sm">
            Active Statement
          </span>
        )}

        {/* Card Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Collapse toggle if node has child nodes */}
            {(node.value || node.condition || node.ifBlock || node.elseBlock || node.block) && (
              <button 
                onClick={() => toggleCollapse(node.id)}
                className="p-0.5 text-muted hover:text-[#faf9f5] transition-colors rounded hover:bg-surface-dark-soft"
              >
                {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
              </button>
            )}
            <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold tracking-wide ${badgeColor}`}>
              {badgeText}
            </span>
            {nodeDetails && (
              <span className="text-[11px] font-mono text-muted-soft select-all">
                {nodeDetails}
              </span>
            )}
          </div>
          <span className="text-[9px] font-mono text-muted-soft select-none">
            Line {node.line}
          </span>
        </div>

        {/* Child Subtree blocks */}
        {!isCollapsed && (
          <div className="mt-2 space-y-2">
            {/* 1. Value branch (for ASSIGN, PRINT expression trees) */}
            {node.value && (
              <div className="pl-3 mt-1 flex items-start gap-1">
                <CornerDownRight size={11} className="text-muted-soft mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-[9px] uppercase tracking-wider text-muted-soft font-bold select-none block mb-1">Value Expression</span>
                  {renderASTNode(node.value, depth + 1)}
                </div>
              </div>
            )}

            {/* 2. Condition branch (for IF, WHILE control expressions) */}
            {node.condition && (
              <div className="pl-3 mt-1 flex items-start gap-1">
                <CornerDownRight size={11} className="text-muted-soft mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-[9px] uppercase tracking-wider text-accent-amber font-bold select-none block mb-1">Condition</span>
                  {renderASTNode(node.condition, depth + 1)}
                </div>
              </div>
            )}

            {/* 3. binary operators child paths */}
            {node.left && (
              <div className="pl-3 mt-1 flex gap-2">
                <div className="flex-1">
                  <span className="text-[9px] uppercase tracking-wider text-muted-soft font-bold select-none block mb-1">Left Oper</span>
                  {renderASTNode(node.left, depth + 1)}
                </div>
                <div className="flex-1">
                  <span className="text-[9px] uppercase tracking-wider text-muted-soft font-bold select-none block mb-1">Right Oper</span>
                  {renderASTNode(node.right, depth + 1)}
                </div>
              </div>
            )}

            {/* 4. If Block path */}
            {node.ifBlock && (
              <div className="pl-3 mt-1 flex items-start gap-1">
                <CornerDownRight size={11} className="text-muted-soft mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-[9px] uppercase tracking-wider text-accent-teal font-bold select-none block mb-1">Then Block</span>
                  {renderASTNode(node.ifBlock, depth + 1)}
                </div>
              </div>
            )}

            {/* 5. Else Block path */}
            {node.elseBlock && (
              <div className="pl-3 mt-1 flex items-start gap-1">
                <CornerDownRight size={11} className="text-muted-soft mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-[9px] uppercase tracking-wider text-primary font-bold select-none block mb-1">Else Block</span>
                  {renderASTNode(node.elseBlock, depth + 1)}
                </div>
              </div>
            )}

            {/* 6. Loop Block path */}
            {node.block && (
              <div className="pl-3 mt-1 flex items-start gap-1">
                <CornerDownRight size={11} className="text-muted-soft mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-[9px] uppercase tracking-wider text-accent-teal font-bold select-none block mb-1">Loop Body</span>
                  {renderASTNode(node.block, depth + 1)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Visualizer Statistics bar */}
      <div className="flex items-center justify-between border-b border-hairline/10 pb-3">
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#faf9f5]">AST Node Hierarchy</h3>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-soft">
          <span>Statements: <span className="font-semibold text-primary">{ast.length}</span></span>
        </div>
      </div>

      {/* Visual Tree Rendering scroll area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar max-h-[500px]">
        {ast.map((stmt) => (
          <div key={stmt.id} className="relative">
            {renderASTNode(stmt)}
          </div>
        ))}
      </div>
    </div>
  );
}
