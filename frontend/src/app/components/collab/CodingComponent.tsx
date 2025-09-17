"use client";

import Editor from "@monaco-editor/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CodingComponent() {
  const [codeContent, setCodeContent] = useState<string>("");
  const [selectedLanguage, setSeletedLanguage] = useState<string>("Javascript");

  function setInitialContent(value: string | undefined) {
    if (value != undefined) {
      setCodeContent(value);
    }
  }

  return (
    <div className="h-full w-[50%] mt-10">
      <div className="mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-40 bg-white text-black">
              {selectedLanguage}{" "}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-10" align="center">
            <DropdownMenuGroup>
              <DropdownMenuItem>Javascript</DropdownMenuItem>
              <DropdownMenuItem>Python</DropdownMenuItem>
              <DropdownMenuItem>C</DropdownMenuItem>
              <DropdownMenuItem>C++</DropdownMenuItem>
              <DropdownMenuItem>Java</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Editor
        height="85vh"
        theme="vs-dark"
        defaultLanguage="python"
        defaultValue="Enter your code here..."
        onChange={(value) => setInitialContent(value)}
      ></Editor>
    </div>
  );
}
