"use client";

import { api } from "@/trpc/react";
import React, { useEffect } from "react";
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
import { autoComplete, composeEmail, polishText, replyToEmail } from "./action";
import { cn } from "@/lib/utils";
import { useThread } from "../../use-thread";
import useThreads from "../../use-threads";
import { turndown } from "@/lib/turndown";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BotMessageSquare,
  MessageSquareDiff,
  MessageSquareQuote,
  MessageSquareText,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useOutsideClick from "@/hooks/use-click-outside";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAtom } from "jotai";
import { templatesAtom } from "@/lib/atoms";
import { type Template } from "@/lib/types";

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
  const { threads, account } = useThreads();
  const [threadId] = useThread();
  const thread = threads?.find((t) => t.id === threadId);

  const autocompleteAI = async (_prompt: string) => {
    const context = thread?.emails
      .map(
        (m) =>
          `Subject: ${m.subject}\nFrom: ${m.from.address}\n\n${turndown.turndown(m.body ?? m.bodySnippet ?? "")}`,
      )
      .join("\n");
    const textStream = autoComplete(context ?? "", _prompt);

    for await (const textPart of await textStream) {
      if (textPart) {
        setGeneration(textPart);
      }
    }
  };

  const replyAI = async (_prompt: string) => {
    const context = thread?.emails
      .map(
        (m) =>
          `Subject: ${m.subject}\nFrom: ${m.from.address}\n\n${turndown.turndown(m.body ?? m.bodySnippet ?? "")}`,
      )
      .join("\n");
    const textStream = replyToEmail(
      [
        context ?? "",
        account &&
          `user's data is:
            - name ${account.name}
            - email ${account.email}
      `,
      ].join("\n"),
      _prompt,
    );

    for await (const textPart of await textStream) {
      if (textPart) {
        setGeneration(textPart);
      }
    }
  };

  // TODO Handle MacOS
  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Alt-a": () => {
          (async () => {
            await autocompleteAI(this.editor.getText());
          })().catch((error: Error) => console.error("error", error.message));
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: false,
    extensions: [StarterKit, customText],
    content: "",
    editorProps: {
      attributes: {
        placeholder: "Write your text here, if you need help use the AI tools",
      },
    },
    onUpdate: ({ editor }) => {
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

  async function polishEmail(_prompt: string) {
    const textStream = polishText(_prompt);
    for await (const textPart of await textStream) {
      if (textPart) {
        setGeneration(textPart);
      }
    }
  }

  const isMobile = useIsMobile();
  const [prompt, setPrompt] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const aiGenerate = async (_prompt: string) => {
    let context: string | undefined = "";
    if (defaultToolbarExpand) {
      context = thread?.emails
        .map(
          (m) =>
            `Subject: ${m.subject}\nFrom: ${m.from.address}\n\n${turndown.turndown(m.body ?? m.bodySnippet ?? "")}`,
        )
        .join("\n");
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
  const handleClickOutside = () => {
    if (!defaultToolbarExpand) setExpanded(false);
  };
  const clickOutsideRef = useOutsideClick(handleClickOutside);

  const [templates, setTemplates] = useAtom(templatesAtom);
  const {
    data: fetchedTemplates,
  } = api.template.getTemplates.useQuery<Template[]>();
  useEffect(() => {
    if (fetchedTemplates) {
      setTemplates(fetchedTemplates);
    }
  }, [fetchedTemplates, setTemplates]);
  return (
    <div
      ref={clickOutsideRef}
      className="h-fit px-2"
      onClick={() => {
        if (!defaultToolbarExpand) setExpanded(true);
      }}
    >
      <div ref={ref} className="space-y-2 p-4">
        {(expanded || isMobile) && (
          <>
            <TagInput
              suggestions={suggestions?.map((s) => s.address) ?? []}
              value={toValues}
              placeholder="Add tags"
              label="To"
              onChange={onToChange}
            />
            <TagInput
              className="hidden md:flex"
              suggestions={suggestions?.map((s) => s.address) ?? []}
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
              autoComplete="message-subject"
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={async () => {
                    const _prompt = editor?.getText() ?? "";
                    editor?.commands.clearContent();
                    await replyAI(_prompt);
                  }}
                  size="icon"
                  variant={"outline"}
                >
                  <BotMessageSquare className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI reply</p>
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
                      setOpen(false);
                      setPrompt("");
                      await aiGenerate(prompt);
                    }}
                  >
                    Generate
                  </Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </span>
          <span className="ml-2 hidden w-1/5 self-center md:block">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Mail Templates" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem
                    key={t.id}
                    value={t.id}
                    onClick={() => {
                      editor?.commands.setContent(t.text);
                    }}
                  >
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </span>
          <span className="inline-flex flex-1 items-center justify-end md:hidden">
            <Button
              onClick={async () => {
                editor?.commands.clearContent();
                handleSend(value);
              }}
              disabled={isSending}
            >
              Send
            </Button>
          </span>
        </div>
        <div className="prose max-h-[25svh] w-full overflow-y-auto rounded-md border px-4 py-2">
          <EditorContent
            value={value}
            editor={editor}
            placeholder="Write your email here..."
          />
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
        </span>
        <Button
          onClick={async () => {
            editor?.commands.clearContent();
            handleSend(value);
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
