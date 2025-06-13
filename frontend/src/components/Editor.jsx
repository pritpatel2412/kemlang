"use client";

import { useRef, useEffect } from "react";
import * as monaco from "monaco-editor";

// ✅ Define KemLang syntax highlighting with Gujarati keywords
const configureSyntaxHighlighting = () => {
  monaco.languages.register({ id: "kemlang" });

  monaco.languages.setMonarchTokensProvider("kemlang", {
    tokenizer: {
      root: [
        [/\/.*$/, "comment"],  // Updated to recognize / for single-line comments
        [/\b(sharu|samaapt|do|lakho|jo|nahitar|jyaare|kharu|khotu)\b/, "keyword"],
        [/".*?"/, "string"],
        [/'.*?'/, "string"],
        [/\b\d+(\.\d+)?\b/, "number"],
        [/[a-zA-Z_]\w*/, "identifier"],
      ],
    },
  });

  monaco.editor.defineTheme("kemlang-theme", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6A9955" },
      { token: "keyword", foreground: "FF5733", fontStyle: "bold" },
      { token: "string", foreground: "CE9178" },
      { token: "number", foreground: "B5CEA8" },
      { token: "identifier", foreground: "9CDCFE" },
    ],
    colors: {
      "editor.background": "#1E1E3A",
      "editor.foreground": "#FFFFFF",
      "editorLineNumber.foreground": "#858585",
      "editor.lineHighlightBackground": "#2A2A4A",
      "editorCursor.foreground": "#FFFFFF",
      "editor.selectionBackground": "#3A3A5A",
    },
  });
};

export default function Editor({ code, onChange }) {
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    configureSyntaxHighlighting();

    editorRef.current = monaco.editor.create(containerRef.current, {
      value: code,
      language: "kemlang",
      theme: "kemlang-theme",
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      tabSize: 2,
      fontFamily: "'JetBrains Mono', Menlo, Monaco, Consolas, monospace",
      lineNumbers: "on",
      roundedSelection: true,
      scrollbar: {
        useShadows: false,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
        verticalHasArrows: false,
        horizontalHasArrows: false,
        vertical: "visible",
        horizontal: "visible",
        verticalScrollbarLeft: 0,
      },
    });

    editorRef.current.onDidChangeModelContent(() => {
      onChange(editorRef.current.getValue());
    });

    editorRef.current.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => {
        document.getElementById("run-code-button")?.click();
      }
    );

    return () => {
      editorRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && code !== editorRef.current.getValue()) {
      editorRef.current.setValue(code);
    };
  }, [code]);

  return <div ref={containerRef} className="h-full w-full" />;
}