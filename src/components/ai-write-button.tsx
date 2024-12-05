"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquareQuote } from "lucide-react";
import React from "react";
import { useThread } from "../app/mail/use-thread";
import useThreads from "../app/mail/use-threads";
import { Button } from "@/components/ui/button";
import { composeEmail } from "../lib/ai/action";
import { turndown } from "@/lib/turndown";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type AIWriteButtonProps = {
  onGenerate: (value: string) => void;
  isComposing?: boolean;
};

const AIWriteButton = ({ isComposing, onGenerate }: AIWriteButtonProps) => {
  const [prompt, setPrompt] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const { account, threads } = useThreads();
  const [threadId] = useThread();
  const thread = threads?.find((t) => t.id === threadId);
  const aiWrite = async (prompt: string) => {
    let context: string | undefined = "";
    if (!isComposing) {
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
      prompt,
      account!.id,
    );
    for await (const textPart of await textStream) {
      if (textPart) {
        onGenerate(textPart);
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              size="icon"
              variant={"outline"}
              aria-label="ai-write"
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
          <DialogTitle>AI Compose</DialogTitle>
          <div className="h-2"></div>
          <Textarea
            placeholder="What would you like to write?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="h-2"></div>
          <Button
            aria-label="generate"
            onClick={async () => {
              await aiWrite(prompt);
              setOpen(false);
              setPrompt("");
            }}
          >
            Generate
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AIWriteButton;
