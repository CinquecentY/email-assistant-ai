"use client";

import React from "react";
import { EditorContent, isMacOS, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Text from "@tiptap/extension-text";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { cn } from "@/lib/utils";
import { autoComplete } from "@/lib/ai/action";
import TipTapMenuBar from "@/components/menu-bar";
import { Label } from "@/components/ui/label";
import AIMenuBar from "@/components/ai-menu-bar";

type TemplateEditorProps = {
  name: string;
  text: string;
  handleSave: (nameValue: string, textValue: string) => void;
  isSaving: boolean;
};

const TemplateEditor = ({
  name,
  text,
  handleSave,
  isSaving,
}: TemplateEditorProps) => {
  const [ref] = useAutoAnimate();
  const [nameValue, setNameValue] = React.useState(name);
  const [textValue, setTextValue] = React.useState(text);

  const [generation, setGeneration] = React.useState("");
  const autocompleteAI = async (_prompt: string) => {
    const context = "";
    const textStream = autoComplete(context ?? "", _prompt);

    for await (const textPart of await textStream) {
      if (textPart) {
        setGeneration(textPart);
      }
    }
  };

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Alt-a": () => {
          const _prompt = editor?.getText() ?? "";
          editor?.commands.clearContent();
          (async () => {
            await autocompleteAI(_prompt);
          })().catch((error: Error) => console.error("error", error.message));
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: false,
    extensions: [StarterKit, customText],
    content: textValue,
    editorProps: {
      attributes: {
        placeholder: "Write your template here...",
      },
    },
    onUpdate: ({ editor }) => {
      setTextValue(editor.getHTML());
    },
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Enter" &&
        editor &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          document.activeElement?.tagName ?? "",
        )
      ) {
        editor.commands.focus();
      }
      if (event.key === "Escape" && editor) {
        editor.commands.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);

  React.useEffect(() => {
    if (!generation || !editor) return;
    editor.commands.insertContent(generation);
  }, [generation, editor]);
  React.useEffect(() => {
    if (!editor) return;
    setNameValue(name);
    setTextValue(text);
    editor.commands.setContent(text);
  }, [text, name, editor]);

  return (
    <div className="h-fit px-2" data-testid="template-editor">
      <div ref={ref} className="space-y-2 p-4">
        <Label htmlFor="template-name">Template Name</Label>
        <Input
          id="template-name"
          data-testid="template-editor-name"
          placeholder="Name"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
        />
      </div>
      <div className="rounded border p-2">
        <div className={cn("mb-2 flex border-b")}>
          <span className="hidden flex-1 items-center md:inline-flex">
            {editor && <TipTapMenuBar editor={editor} />}{" "}
          </span>
          <span className="inline-flex gap-2 py-1">
            <AIMenuBar setGeneration={setGeneration} editor={editor} />
          </span>
          <span className="inline-flex flex-1 items-center justify-end md:hidden">
            <Button
              aria-label="save"
              onClick={async () => {
                handleSave(nameValue, textValue);
              }}
              disabled={isSaving}
            >
              Save
            </Button>
          </span>
        </div>
        <div
          data-testid="template-editor-text"
          className="prose max-h-[25svh] w-full overflow-y-auto rounded-md border px-4 py-2"
        >
          <EditorContent
            value={textValue}
            editor={editor}
            placeholder="Write your template here..."
          />
        </div>
      </div>
      <Separator />
      <div className="hidden items-center justify-between px-4 py-3 md:flex">
        <span className={"gap-1"}>
          <span className="text-sm">
            Tip: Press{" "}
            <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800">
              {`${isMacOS() ? "⌘" : "Alt"} + A`}
            </kbd>{" "}
            for AI autocomplete
          </span>
        </span>
        <Button
          aria-label="save"
          onClick={async () => {
            handleSave(nameValue, textValue);
          }}
          disabled={isSaving}
          data-testid="template-editor-save-button"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default TemplateEditor;
