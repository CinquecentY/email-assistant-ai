"use client";

import { api } from "@/trpc/react";
import React from "react";
import { useLocalStorage } from "usehooks-ts";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Text from "@tiptap/extension-text";
import TipTapMenuBar from "./menu-bar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import TagInput from "./tag-input";
import { Input } from "@/components/ui/input";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import AIComposeButton from "./ai-compose-button";
import { generate } from "./action";
import { readStreamableValue } from "ai/rsc";
import { cn } from "@/lib/utils";

type EmailEditorProps = {
  toValues: { label: string; value: string }[];
  ccValues: { label: string; value: string }[];

  subject: string;
  setSubject: (subject: string) => void;
  to: string[];
  handleSend: (value: string) => void;
  isSending: boolean;

  onToChange: (values: { label: string; value: string }[]) => void;
  onCcChange: (values: { label: string; value: string }[]) => void;

  defaultToolbarExpand?: boolean;
};

const EmailEditor = ({
  toValues,
  ccValues,
  subject,
  setSubject,
  to,
  handleSend,
  isSending,
  onToChange,
  onCcChange,
  defaultToolbarExpand,
}: EmailEditorProps) => {
  const [ref] = useAutoAnimate();
  const [accountId] = useLocalStorage("accountId", "");
  const { data: suggestions } = api.mail.getEmailSuggestions.useQuery(
    { accountId: accountId, query: "" },
    { enabled: !!accountId },
  );
  const [value, setValue] = React.useState("");

  const [expanded, setExpanded] = React.useState(defaultToolbarExpand ?? false);

  const [generation, setGeneration] = React.useState("");

  const aiGenerate = async (prompt: string) => {
    const { output } = await generate(prompt);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setGeneration(delta);
      }
    }
  };

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Alt-a": () => {
          aiGenerate(this.editor.getText());
          return true;
        },
        "Alt-r": () => {
          // TODO Add AI reply function
          setGeneration("AI Reply");
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: false,
    extensions: [StarterKit, customText],
    editorProps: {
      attributes: {
        placeholder: "Write your email here...",
      },
    },
    onFocus: () => {
      if (!defaultToolbarExpand) setExpanded(true);
    },
    onBlur: () => {
      if (!defaultToolbarExpand) setExpanded(false);
    },
    onUpdate: ({ editor, transaction }) => {
      setValue(editor.getHTML());
    },
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Enter" &&
        editor &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          document.activeElement?.tagName || "",
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

  return (
    <div className="px-2">
      <div ref={ref} className="space-y-2 p-4">
        {expanded && (
          <>
            <TagInput
              suggestions={suggestions?.map((s) => s.address) || []}
              value={toValues}
              placeholder="Add tags"
              label="To"
              onChange={onToChange}
            />
            <TagInput
              suggestions={suggestions?.map((s) => s.address) || []}
              value={ccValues}
              placeholder="Add tags"
              label="Cc"
              onChange={onCcChange}
            />
            <Input
              id="subject"
              className="w-full"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </>
        )}
      </div>
      <div className="rounded border p-2">
        <div
          className={cn(
            "mb-2 flex border-b",
            !expanded && "[&_svg]:text-muted-foreground",
          )}
        >
          <span className="flex-1">
            {editor && <TipTapMenuBar editor={editor} />}{" "}
          </span>
          <span className="py-1">
            <AIComposeButton
              isComposing={defaultToolbarExpand}
              onGenerate={setGeneration}
            />
          </span>
        </div>
        <div className="prose w-full px-4">
          <EditorContent
            value={value}
            editor={editor}
            placeholder="Write your email here..."
          />
        </div>
      </div>
      <Separator />
      <div className="flex items-center justify-between px-4 py-3">
        <span className="flex gap-1">
          <span className="text-sm">
            Tip: Press{" "}
            <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800">
              Alt + A
            </kbd>{" "}
            for AI autocomplete
          </span>
          <span className="text-sm">
            <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800">
              Alt + R
            </kbd>{" "}
            for AI reply
          </span>
        </span>
        <Button
          onClick={async () => {
            editor?.commands.clearContent();
            await handleSend(value);
          }}
          disabled={isSending}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default EmailEditor;
