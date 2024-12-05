import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Plus } from "lucide-react";
import React from "react";
import TemplateEditor from "./template-editor";
import { useAtom } from "jotai";
import { type Template } from "@/lib/types";
import { templatesAtom } from "@/lib/atoms";
import { api } from "@/trpc/react";

const WriteTemplateButton = () => {
  const [open, setOpen] = React.useState(false);
  const [, setTemplates] = useAtom<Template[]>(templatesAtom);
  const addTemplateMutation = api.template.addTemplate.useMutation();
  const addTemplate = (newTemplate: Template) => {
    addTemplateMutation.mutate(newTemplate, {
      onSuccess: (data) => {
        setTemplates((prev) => [...prev, data as Template]);
      },
      onError: (error) => {
        console.error(error);
      },
    });
    setOpen(false);
  };
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full p-3" data-testid="new-template-button">
          <Plus className="md:mr-1" />
          <p className="hidden md:block">New Template</p>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New Template</DrawerTitle>
          <TemplateEditor
            name=""
            text=""
            handleSave={(name, text) =>
              addTemplate({ id: "", name, text, updatedDate: new Date() })
            }
            isSaving={false}
          />
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default WriteTemplateButton;
