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
  return (
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
  );
};

export default MailTemplatesSelect;
