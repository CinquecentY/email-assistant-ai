import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import React from "react";
import TemplateList from "./template-list";
import TemplateDisplay from "./template-display";

const TemplatesDesktop = () => {
  const [templateId, setTemplateId] = React.useState("");

  function selectTemplate(_templateId: string) {
    setTemplateId(_templateId);
  }

  function deleteTemplate() {
    setTemplateId("");
  }
  return (
    <>
      <ResizablePanel defaultSize={32} minSize={30} className="h-screen w-full">
        <div className="flex items-center gap-4 px-4 py-2">
          <h1 className="text-xl font-bold">Inbox</h1>
        </div>
        <Separator />
        <TemplateList
          selectTemplateHandle={selectTemplate}
          deleteTemplateHandle={deleteTemplate}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={48} minSize={30} className="h-screen w-full">
        <div className="flex min-h-11 items-center p-2"></div>
        <TemplateDisplay templateId={templateId} />
      </ResizablePanel>
    </>
  );
};

export default TemplatesDesktop;
