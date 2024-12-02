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
import { Separator } from "@/components/ui/separator";
import { templatesTabAtom } from "@/lib/atoms";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import { formatDistance, subDays } from "date-fns";
import { useAtom } from "jotai";
import { Trash2 } from "lucide-react";
import React from "react";

const TemplatesMobile = () => {
  const [tab, setTab] = React.useState("templates");
  const [templateId] = React.useState("");
  const template = {
    name: "Template",
    date: formatDistance(subDays(new Date(), 3), new Date(), {
      addSuffix: true,
    }),
    text: `Dear Man,
    In quis massa sed nisi aliquam hendrerit. Donec mattis ex vel mauris sagittis, vehicula accumsan velit maximus.
    Suspendisse vel mauris fermentum, aliquam ante id, ornare lacus. Etiam congue nunc et condimentum condimentum. Mauris eget sodales tortor.`,
  };
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
                  "relative flex h-auto flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm text-muted-foreground transition-all hover:text-accent-foreground",
                )}
              >
                <span className="inline-flex w-full gap-2">
                  <span
                    className="flex flex-1 flex-col"
                    onClick={() => {
                      setTab("template");
                    }}
                  >
                    <div className="w-fit cursor-pointer font-bold">
                      {template.name} {i + 1}
                    </div>
                    <div
                      className={cn(
                        "text-xs font-medium",
                        templateId
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {template.date}
                    </div>
                  </span>
                  <span>
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
                </span>
                <Separator />
                <div
                  className="line-clamp-3 w-full whitespace-pre-wrap break-words"
                  onClick={() => {
                    setTab("template");
                  }}
                >
                  {template.text}
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
