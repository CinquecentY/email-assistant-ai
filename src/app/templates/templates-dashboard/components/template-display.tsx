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
  const [template, setTemplate] = useState(
    templates.find((t) => t.id === templateId),
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
    setTemplate(templates.find((t) => t.id === templateId));
  }, [templateId, templates]);
  return (
    <section className="h-full max-h-[calc(100vh-50px)] w-full bg-background">
      {template ? (
        <div className="h-full">
          <TemplateEditor
            name={template.name}
            text={template.text}
            handleSave={(name, text) => {
              updateTemplate({
                id: template.id,
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
