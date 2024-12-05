"use client";

import { api } from "@/trpc/react";
import React, { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Text from "@tiptap/extension-text";
import TipTapMenuBar from "./menu-bar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { autoComplete, composeEmail, polishText, replyToEmail } from "./action";
import { cn } from "@/lib/utils";
import { useThread } from "../../use-thread";
import useThreads from "../../use-threads";
import { turndown } from "@/lib/turndown";
import { useIsMobile } from "@/hooks/use-mobile";
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
import SendInputs from "./send-inputs";
import AIMenuBar from "../mail-dashboard/components/ai-menu-bar";
import MailTemplatesSelect from "./mail-template-select";

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
          <SendInputs
            toValues={toValues}
            ccValues={ccValues}
            subject={subject}
            setSubject={setSubject}
            onToChange={onToChange}
            onCcChange={onCcChange}
          />
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
            {editor && <TipTapMenuBar editor={editor} />}
          </span>
          <span className="inline-flex gap-2 py-1">
            <AIMenuBar
              defaultToolbarExpand={defaultToolbarExpand}
              editor={editor}
              setGeneration={setGeneration}
            />
          </span>
          <span className="ml-2 hidden w-1/5 self-center md:block">
            <MailTemplatesSelect editor={editor} />
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
