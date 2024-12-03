"use client";

import React from "react";
import { useLocalStorage } from "usehooks-ts";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Text from "@tiptap/extension-text";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookType,
  BotMessageSquare,
  MessageSquareDiff,
  MessageSquareQuote,
  MessageSquareReply,
  MessageSquareText,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useIsClickOutside from "@/hooks/use-click-outside";
import useOutsideClick from "@/hooks/use-click-outside";
import {
  autoComplete,
  polishText,
  composeEmail,
} from "@/app/mail/components/email-editor/action";
import TipTapMenuBar from "@/app/mail/components/email-editor/menu-bar";
import useThreads from "@/app/mail/use-threads";
import { Label } from "@/components/ui/label";

type TemplateEditorProps = {
  name: string;
  text: string;
  handleSave: (nameValue: string, textValue: string) => void;
  isSaving: boolean;
  defaultToolbarExpand?: boolean;
};

const TemplateEditor = ({
  name,
  text,
  handleSave,
  isSaving,
  defaultToolbarExpand,
}: TemplateEditorProps) => {
  const [ref] = useAutoAnimate();
  const { account } = useThreads();
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
        "Alt-p": () => {
          const _prompt = editor?.getText() ?? "";
          editor?.commands.clearContent();
          (async () => {
            await polishEmail(_prompt);
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
    editor.commands.setContent(textValue);
  }, [editor, name, text, textValue]);

  async function polishEmail(_prompt: string) {
    const textStream = polishText(_prompt);
    for await (const textPart of await textStream) {
      if (textPart) {
        setGeneration(textPart);
      }
    }
  }

  const [prompt, setPrompt] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const aiGenerate = async (_prompt: string) => {
    let context: string | undefined = "";
    if (defaultToolbarExpand) {
      context = "";
    }

    const textStream = composeEmail(
      [
        context ?? "",
        account &&
          `user data is {name:${account.name}, email:${account.email}}`,
      ].join("\n"),
      _prompt,
      account!.id,
    );
    for await (const textPart of await textStream) {
      if (textPart) {
        setGeneration(textPart);
      }
    }
  };

  return (
    <div className="flex h-full flex-col px-2">
      <div ref={ref} className="space-y-2 p-4">
        <Label htmlFor="template-name">Template Name</Label>
        <Input
          id="template-name"
          placeholder="Name"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
        />
      </div>
      <div className="flex flex-1 flex-col rounded border p-2">
        <div className={cn("mb-2 flex border-b")}>
          <span className="hidden flex-1 items-center md:inline-flex">
            {editor && <TipTapMenuBar editor={editor} />}{" "}
          </span>
          <span className="inline-flex gap-2 py-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => autocompleteAI(editor?.getText() ?? "")}
                  size="icon"
                  variant={"outline"}
                >
                  <MessageSquareDiff className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI autocomplete</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={async () => {
                    const _prompt = editor?.getText() ?? "";
                    editor?.commands.clearContent();
                    await polishEmail(_prompt);
                  }}
                  size="icon"
                  variant={"outline"}
                >
                  <MessageSquareText className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI improve</p>
              </TooltipContent>
            </Tooltip>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setOpen(true)}
                      size="icon"
                      variant={"outline"}
                    >
                      <MessageSquareQuote className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI write</p>
                  </TooltipContent>
                </Tooltip>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>AI Write</DialogTitle>
                  <div className="h-2"></div>
                  <Textarea
                    placeholder="What would you like to write?"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <div className="h-2"></div>
                  <Button
                    onClick={async () => {
                      await aiGenerate(prompt);
                      setOpen(false);
                      setPrompt("");
                    }}
                  >
                    Generate
                  </Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </span>
          <span className="inline-flex flex-1 items-center justify-end md:hidden">
            <Button
              onClick={async () => {
                handleSave(nameValue, textValue);
              }}
              disabled={isSaving}
            >
              Save
            </Button>
          </span>
        </div>
        <div className="prose max-h-full w-full flex-1 overflow-y-auto rounded-md border px-4 py-2">
          <EditorContent value={textValue} editor={editor} />
        </div>
      </div>
      <Separator />
      <div className="hidden items-center justify-between px-4 py-3 md:flex">
        <span className={"gap-1"}>
          <span className="text-sm">
            Tip: Press{" "}
            <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800">
              Alt + A
            </kbd>{" "}
            for AI autocomplete
          </span>
          <span className="text-sm">
            <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800">
              Alt + P
            </kbd>{" "}
            for AI to improve written content
          </span>
        </span>
        <Button
          onClick={async () => {
            handleSave(nameValue, textValue);
          }}
          disabled={isSaving}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default TemplateEditor;
