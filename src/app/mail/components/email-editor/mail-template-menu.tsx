import { templatesAtom } from "@/lib/atoms";
import { type Template } from "@/lib/types";
import { api } from "@/trpc/react";

import { type Editor } from "@tiptap/react";
import { useAtom } from "jotai";
import React, { useEffect } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const MailTemplatesMenu = ({ editor }: { editor: Editor | null }) => {
  const [templates, setTemplates] = useAtom(templatesAtom);
  const { data: fetchedTemplates } =
    api.template.getTemplates.useQuery<Template[]>();
  useEffect(() => {
    if (fetchedTemplates) {
      setTemplates(fetchedTemplates);
    }
  }, [fetchedTemplates, setTemplates]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex w-full rounded-lg border py-1 font-medium">
        <ChevronDown />
        Mail Templates
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {templates.map((template) => (
          <DropdownMenuItem
            aria-label="mail-template-button"
            key={template.id}
            className="w-full cursor-pointer"
            onClick={() => {
              editor?.commands.setContent(template.text);
            }}
          >
            {template.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MailTemplatesMenu;
