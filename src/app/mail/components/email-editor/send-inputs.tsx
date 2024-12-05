import { api } from "@/trpc/react";
import React from "react";
import { useLocalStorage } from "usehooks-ts";
import TagInput from "./tag-input";
import { Input } from "@/components/ui/input";

interface SendInputsProps {
  toValues: {
    label: string;
    value: string;
  }[];
  ccValues: {
    label: string;
    value: string;
  }[];
  subject: string;
  onToChange: (
    values: {
      label: string;
      value: string;
    }[],
  ) => void;
  onCcChange: (
    values: {
      label: string;
      value: string;
    }[],
  ) => void;
  setSubject: (subject: string) => void;
}

const SendInputs = ({
  toValues,
  ccValues,
  subject,
  onToChange,
  onCcChange,
  setSubject,
}: SendInputsProps) => {
  const [accountId] = useLocalStorage("accountId", "");
  const { data: suggestions } = api.mail.getEmailSuggestions.useQuery(
    { accountId: accountId, query: "" },
    { enabled: !!accountId },
  );

  return (
    <>
      <TagInput
        suggestions={suggestions?.map((s) => s.address) ?? []}
        value={toValues}
        placeholder="Add tags"
        label="To"
        onChange={onToChange}
      />
      <TagInput
        className="hidden md:flex"
        suggestions={suggestions?.map((s) => s.address) ?? []}
        value={ccValues}
        placeholder="Add tags"
        label="Cc"
        onChange={onCcChange}
      />
      <Input
        id="subject"
        className="w-full"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        autoComplete="message-subject"
      />
    </>
  );
};

export default SendInputs;
