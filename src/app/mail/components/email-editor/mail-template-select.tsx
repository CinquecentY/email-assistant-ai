import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { templatesAtom } from "@/lib/atoms";
import { type Template } from "@/lib/types";
import { api } from "@/trpc/react";

import { type Editor } from "@tiptap/react";
import { useAtom } from "jotai";
import React, { useEffect } from "react";

const MailTemplatesSelect = ({ editor }: { editor: Editor | null }) => {
  const [templates, setTemplates] = useAtom(templatesAtom);
  const { data: fetchedTemplates } =
    api.template.getTemplates.useQuery<Template[]>();
  useEffect(() => {
    if (fetchedTemplates) {
      setTemplates(fetchedTemplates);
    }
  }, [fetchedTemplates, setTemplates]);
  const [open, setOpen] = React.useState(false);
  return (
    <Select open={open}>
      <SelectTrigger onClick={() => setOpen(true)}>
        <SelectValue placeholder="Mail Templates" />
      </SelectTrigger>
      <SelectContent>
        {templates.map((template) => (
          <Button
            variant={"ghost"}
            key={template.id}
            className="w-full font-normal"
            onClick={() => {
              editor?.commands.setContent(template.text);
              setOpen(false);
            }}
          >
            {template.name}
          </Button>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MailTemplatesSelect;
