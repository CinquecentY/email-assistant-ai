import { templatesAtom } from "@/lib/atoms";
import { api } from "@/trpc/react";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import TemplateEditor from "./template-editor";
import { type Template } from "@/lib/types";

interface TemplateDisplayProps {
  updateTemplateHandle?: () => void;
  templateId?: string;
}

const TemplateDisplay = ({
  updateTemplateHandle,
  templateId,
}: TemplateDisplayProps) => {
  const [templates, setTemplates] = useAtom<Template[]>(templatesAtom);
  const [nameValue, setNameValue] = useState<string>(
    templates.find((t) => t.id === templateId)?.name ?? "",
  );
  const [textValue, setTextValue] = useState<string>(
    templates.find((t) => t.id === templateId)?.text ?? "",
  );
  const updateTemplateMutation = api.template.updateTemplate.useMutation();
  function updateTemplate(template: Template) {
    updateTemplateMutation.mutate(
      { ...template },
      {
        onError: (error) => {
          console.error(error);
        },
        onSuccess: () => {
          setTemplates(
            templates.map((t) => (t.id === template.id ? template : t)),
          );
          if (updateTemplateHandle) updateTemplateHandle();
        },
      },
    );
  }
  useEffect(() => {
    setNameValue(templates.find((t) => t.id === templateId)?.name ?? "");
    setTextValue(templates.find((t) => t.id === templateId)?.text ?? "");
  }, [templateId, templates]);
  return (
    <section className="size-full max-h-[calc(100vh-50px)] bg-background">
      {templateId ? (
        <div className="h-full">
          <TemplateEditor
            name={nameValue}
            text={textValue}
            handleSave={(name, text) => {
              updateTemplate({
                id: templateId,
                name,
                text,
                updatedDate: new Date(),
              });
            }}
            isSaving={false}
          />
        </div>
      ) : (
        <>
          <div className="h-full bg-background p-8 text-center text-muted-foreground">
            No template selected
          </div>
        </>
      )}
    </section>
  );
};

export default TemplateDisplay;
