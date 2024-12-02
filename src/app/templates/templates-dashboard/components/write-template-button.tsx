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

const WriteTemplateButton = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full p-3">
          <Plus className="md:mr-1" />
          <p className="hidden md:block">New Template</p>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="">
        <DrawerHeader>
          <DrawerTitle>New Template</DrawerTitle>
          <TemplateEditor
            name=""
            text=""
            handleSave={() => null}
            isSaving={false}
          />
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default WriteTemplateButton;
