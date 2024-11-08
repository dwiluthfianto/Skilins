"use client";

import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { useState } from "react";
import { Content } from "@tiptap/react";

export default function CreateStories() {
  const [value, setValue] = useState<Content>("");

  return (
    <MinimalTiptapEditor
      value={value}
      onChange={setValue}
      className="w-full"
      editorContentClassName="p-5"
      output="html"
      placeholder="Type your description here..."
      autofocus={true}
      editable={true}
      editorClassName="focus:outline-none"
    />
  );
}