"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Forward, Send, SparklesIcon } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { useChat } from "ai/react";
import React from "react";

const transitionDebug = {
  type: "easeOut",
  duration: 0.2,
};
const AskAI = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const [accountId] = useLocalStorage("accountId", "");
  const { input, handleInputChange, setInput, handleSubmit, messages } =
    useChat({
      api: "/api/chat",
      body: {
        accountId,
      },
      onError: (error) => {
        toast.error("Error", {
          description: error.message,
        });
      },
      initialMessages: [],
    });
  // TODO Disable AI when not linked to account
  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  if (isCollapsed) return null;
  return (
    <div>
      <motion.div className="flex flex-1 flex-col items-end justify-end rounded-lg border bg-gray-100 p-4 pb-4 shadow-inner dark:bg-gray-900">
        <div
          className="flex max-h-[50vh] w-full flex-col gap-2 overflow-y-auto"
          id="message-container"
        >
          <AnimatePresence mode="wait">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                layout="position"
                className={cn(
                  "z-10 mt-2 max-w-[250px] break-words bg-gray-200",
                  {
                    "self-end rounded-b-2xl rounded-l-2xl text-gray-900 dark:bg-gray-800 dark:text-gray-100":
                      message.role === "user",
                    "self-start rounded-b-2xl rounded-r-2xl bg-blue-500 text-white dark:bg-blue-900":
                      message.role === "assistant",
                  },
                )}
                layoutId={`container-[${messages.length - 1}]`}
                transition={transitionDebug}
              >
                <div className="px-3 py-2 text-[15px] leading-[15px]">
                  {message.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {messages.length > 0 && <div className="h-4"></div>}
        <div className="w-full">
          {messages.length === 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-4">
                <SparklesIcon className="size-6 text-gray-500" />
                <div>
                  <p className="text-gray-900 dark:text-gray-100">
                    Ask AI all what you want
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ask AI will help with your emails, your events...
                  </p>
                </div>
              </div>
              <div className="h-2"></div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setInput("What can I ask?")}
                  className="rounded-b-xl rounded-r-xl bg-gray-800 px-2 py-1 text-xs text-gray-200"
                >
                  What can I ask?
                </button>
                <span className="inline-flex w-full justify-end">
                  <button
                    onClick={() =>
                      setInput("What can you tell me about my emails?")
                    }
                    className="rounded-b-xl rounded-l-xl bg-gray-800 px-2 py-1 text-xs text-gray-200"
                  >
                    What can you tell me about my emails?
                  </button>
                </span>
                <button
                  onClick={() => setInput("Who are my clients?")}
                  className="rounded-b-xl rounded-r-xl bg-gray-800 px-2 py-1 text-xs text-gray-200"
                >
                  Who are my clients?
                </button>
                <span className="inline-flex w-full justify-end md:block md:w-auto">
                  <button
                    onClick={() => setInput("When is my next meeting?")}
                    className="rounded-b-xl rounded-l-xl bg-gray-800 px-2 py-1 text-xs text-gray-200"
                  >
                    When is my next meeting?
                  </button>
                </span>
              </div>
            </div>
          )}
          {accountId ? (
            <form onSubmit={handleSubmit} className="flex w-full">
              <input
                type="text"
                onChange={handleInputChange}
                value={input}
                className="py- relative h-9 flex-grow rounded-full border border-gray-200 bg-white px-3 text-[15px] outline-none placeholder:text-[13px] placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:ring-blue-500/20 dark:focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-700"
                placeholder="Message Ask AI"
                autoComplete="new-text"
              />
              <motion.div
                key={messages.length}
                layout="position"
                className="pointer-events-none absolute z-10 flex h-9 w-[250px] items-center overflow-hidden break-words rounded-full bg-gray-200 [word-break:break-word] dark:bg-gray-800"
                layoutId={`container-[${messages.length}]`}
                transition={transitionDebug}
                initial={{ opacity: 0.6, zIndex: -1 }}
                animate={{ opacity: 0.6, zIndex: -1 }}
                exit={{ opacity: 1, zIndex: 1 }}
              >
                <div className="px-3 py-2 text-[15px] leading-[15px] text-gray-900 dark:text-gray-100">
                  {input}
                </div>
              </motion.div>
              <button
                type="submit"
                className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800"
                aria-label="send"
                disabled={input.length === 0}
              >
                <Forward className="size-4 text-gray-500 dark:text-gray-300" />
              </button>
            </form>
          ) : (
            <div className="rounded border bg-muted p-2 text-muted-foreground">
              You must add an account to use Ask AI.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AskAI;
