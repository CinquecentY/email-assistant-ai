import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { turndown } from "@/lib/turndown";
import { type Editor } from "@tiptap/react";
import {
  MessageSquareDiff,
  MessageSquareText,
  BotMessageSquare,
  MessageSquareQuote,
} from "lucide-react";
import React from "react";
import { useThread } from "../app/mail/use-thread";
import useThreads from "../app/mail/use-threads";
import {
  autoComplete,
  polishText,
  composeEmail,
  replyToEmail,
} from "../lib/ai/action";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface AIMenuBarProps {
  defaultToolbarExpand?: boolean;
  editor: Editor | null;
  isReplyBox?: boolean;
  setGeneration: (text: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const AIMenuBar = ({
  defaultToolbarExpand,
  editor,
  isReplyBox = false,
  setGeneration,
  isLoading = false,
  setIsLoading,
}: AIMenuBarProps) => {
  const { threads, account } = useThreads();
  const [threadId] = useThread();
  const thread = threads?.find((t) => t.id === threadId);

  const autocompleteAI = async (_prompt: string) => {
    if (isLoading) return;
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
    setIsLoading(false);
  };

  async function polishEmail(_prompt: string) {
    if (isLoading) return;
    const textStream = polishText(_prompt);
    for await (const textPart of await textStream) {
      if (textPart) {
        setGeneration(textPart);
      }
    }
    setIsLoading(false);
  }
  const [prompt, setPrompt] = React.useState("");
  const [open, setOpen] = React.useState(false);

  async function aiWrite(_prompt: string) {
    if (isLoading) return;

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
        "This is the user's email thread the user must reply to",
        context,
        "-----------",
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
    setIsLoading(false);
  }
  async function replyAI(_prompt: string) {
    if (isLoading) return;

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
    setIsLoading(false);
  }
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label="ai-autocomplete"
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
            aria-label="ai-improve"
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
      {isReplyBox && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="ai-reply"
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
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="ai-write"
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
              aria-label="generate"
              onClick={async () => {
                setOpen(false);
                setPrompt("");
                await aiWrite(prompt);
              }}
            >
              Generate
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIMenuBar;
