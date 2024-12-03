import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { formatDistance } from "date-fns";
import { useAtom } from "jotai";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { templatesAtom } from "@/lib/atoms";
import { Button } from "@/components/ui/button";
import { type Template } from "@/lib/types";

interface TemplateListProps {
  selectTemplateHandle: (templateId: string) => void;
  deleteTemplateHandle?: () => void;
}

const TemplateList = ({
  selectTemplateHandle,
  deleteTemplateHandle,
}: TemplateListProps) => {
  const [templates, setTemplates] = useAtom<Template[]>(templatesAtom);

  const {
    data: fetchedTemplates,
    isLoading,
    error,
  } = api.template.getTemplates.useQuery<Template[]>();

  const deleteTemplateMutation = api.template.deleteTemplate.useMutation();
  function deleteTemplate(id: string) {
    deleteTemplateMutation.mutate(
      { id },
      {
        onError: (error) => {
          console.error(error);
        },
        onSuccess: (data) => {
          setTemplates(templates.filter((template) => template.id !== id));
          if (deleteTemplateHandle) deleteTemplateHandle();
        },
      },
    );
  }

  useEffect(() => {
    if (fetchedTemplates) {
      setTemplates(fetchedTemplates);
    }
  }, [fetchedTemplates, setTemplates]);

  return (
    <article className="flex h-full max-h-[calc(100vh-50px)] flex-1 flex-col gap-2 overflow-y-auto bg-background p-4 pt-2">
      {templates.length === 0 ? (
        <>
          <div className="flex h-full items-center justify-center">
            <div className="text-muted-foreground">No templates found</div>
          </div>
        </>
      ) : (
        templates.map((template) => (
          <div
            key={template.id}
            className={cn(
              "relative flex h-auto flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm text-muted-foreground transition-all hover:text-accent-foreground",
            )}
          >
            <span className="inline-flex w-full gap-2">
              <span
                className="flex flex-1 flex-col"
                onClick={() => {
                  selectTemplateHandle(template.id);
                }}
              >
                <div className="w-fit cursor-pointer font-bold">
                  {template.name}
                </div>
                <div className={cn("text-xs font-medium")}>
                  {formatDistance(template.updatedDate, new Date(), {
                    addSuffix: true,
                  })}
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
                        <Button
                          variant={"destructive"}
                          type="submit"
                          onClick={() => deleteTemplate(template.id)}
                        >
                          Confirm
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </span>
            </span>
          </div>
        ))
      )}
    </article>
  );
};
export default TemplateList;
