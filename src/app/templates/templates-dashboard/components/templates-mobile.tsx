import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ResizablePanel } from "@/components/ui/resizable";
import { templatesTabAtom } from "@/lib/atoms";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import { useAtom } from "jotai";
import { Trash2 } from "lucide-react";
import React from "react";

const TemplatesMobile = () => {
  const [tab, setTab] = useAtom(templatesTabAtom);
  return (
    <ResizablePanel>
      <Tabs defaultValue="templates" value={tab} className="h-screen">
        <TabsContent value="templates" className="h-full">
          <div className="flex h-11 items-center gap-4 px-4 py-1">
            <h1 className="text-lg font-bold">Mail Templates</h1>
          </div>
          <Separator />
          <article className="flex h-full max-h-[calc(100vh-50px)] flex-1 flex-col gap-2 overflow-y-auto bg-background p-4 pt-2">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "relative flex h-auto flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all",
                )}
              >
                <span className="inline-flex w-full gap-2">
                  <button
                    onClick={() => {
                      setTab("template");
                    }}
                    className="flex-1 text-left font-bold hover:text-accent-foreground"
                  >
                    Name of template {i + 1}
                  </button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="rounded-full bg-transparent text-foreground hover:bg-destructive hover:text-destructive-foreground">
                        <Trash2 />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-xl">
                      <DialogHeader>
                        <DialogTitle>Delete Template?</DialogTitle>
                        <DialogDescription>
                          This action is irreversible.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant={"destructive"} type="submit">
                            Confirm
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </span>
                <div className="line-clamp-3 w-full break-words text-muted-foreground">
                Hi [Recipient's Name],&#10;
I hope this email finds you well. I wanted to share an exciting opportunity that could benefit you greatly. Let's discuss further at your convenience.
Best regards, [Your Name] [Your Position] [Your Company] [Your Contact Information]
                </div>
              </div>
            ))}
          </article>
        </TabsContent>
        <TabsContent value="template" className="h-screen w-full">
          <div className="flex min-h-11 items-center p-2">
            <Button
              className={"h-7 md:hidden"}
              variant={"outline"}
              onClick={() => setTab("templates")}
            >
              <h1 className="text-lg font-bold">Templates</h1>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </ResizablePanel>
  );
};

export default TemplatesMobile;
