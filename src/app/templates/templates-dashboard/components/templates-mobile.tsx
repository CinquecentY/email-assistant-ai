import { Button } from "@/components/ui/button";
import { ResizablePanel } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import { ArrowLeft } from "lucide-react";
import React from "react";
import TemplateList from "./template-list";
import TemplateDisplay from "./template-display";

const TemplatesMobile = () => {
  const [tab, setTab] = React.useState("templates");
  const [templateId, setTemplateId] = React.useState("");

  function selectTemplate(_templateId: string) {
    setTemplateId(_templateId);
    setTab("template");
  }

  function deleteTemplate() {
    setTemplateId("");
  }

  function updateTemplate() {
    setTab("templates");
  }

  return (
    <ResizablePanel>
      <Tabs defaultValue="templates" value={tab} className="h-screen">
        <TabsContent value="templates" className="h-full">
          <div className="flex h-11 items-center gap-4 px-4 py-1">
            <h1 className="text-lg font-bold">Mail Templates</h1>
          </div>
          <Separator />
          <TemplateList
            selectTemplateHandle={selectTemplate}
            deleteTemplateHandle={deleteTemplate}
          />
        </TabsContent>
        <TabsContent value="template" className="h-screen w-full">
          <div className="flex min-h-11 items-center p-2 pb-0">
            <Button
              className={
                "h-7 rounded-b-none rounded-t-lg font-bold shadow md:hidden"
              }
              variant={"outline"}
              onClick={() => setTab("templates")}
            >
              <ArrowLeft /> Templates
            </Button>
          </div>
          <TemplateDisplay
            updateTemplateHandle={updateTemplate}
            templateId={templateId}
          />
        </TabsContent>
      </Tabs>
    </ResizablePanel>
  );
};

export default TemplatesMobile;
