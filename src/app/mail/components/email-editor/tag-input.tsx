import { cn } from "@/lib/utils";
import React, { useState } from "react";
import Avatar from "react-avatar";
import Select from "react-select";

type TagInputProps = {
  className?: string;
  suggestions: string[];
  defaultValues?: { label: string; value: string }[];
  placeholder: string;
  label: string;

  onChange: (values: { label: string; value: string }[]) => void;
  value: { label: string; value: string }[];
};

const TagInput: React.FC<TagInputProps> = ({
  className,
  suggestions,
  defaultValues = [],
  label,
  onChange,
  value,
}) => {
  const [input, setInput] = useState("");

  const options = suggestions.map((suggestion) => ({
    label: (
      <span className="flex items-center gap-2">
        <Avatar name={suggestion} size="25" textSizeRatio={2} round={true} />
        {suggestion}
      </span>
    ),
    value: suggestion,
  }));

  return (
    <div className={cn("flex items-center rounded-md border", className)}>
      <span className="ml-3 text-sm text-gray-500">{label}</span>
      <Select
        value={value}
        // @ts-expect-error the type 'MultiValue<{ label: string; value: string; }>' is 'readonly' and cannot be assigned to the mutable type '{ label: string; value: string; }[]'.
        onChange={onChange}
        className="w-full flex-1"
        isMulti
        onInputChange={setInput}
        defaultValue={defaultValues}
        placeholder={""}
        // @ts-expect-error Types of property 'label' are incompatible. Because type 'Element' is not assignable to type 'string'.
        options={
          input
            ? options.concat({
                label: (
                  <span className="flex items-center gap-2">
                    <Avatar
                      name={input}
                      size="25"
                      textSizeRatio={2}
                      round={true}
                    />
                    {input}
                  </span>
                ),
                value: input,
              })
            : options
        }
        classNames={{
          control: () => {
            return "!border-none !outline-none !ring-0 !shadow-none focus:border-none focus:outline-none focus:ring-0 focus:shadow-none dark:bg-transparent";
          },
          multiValue: () => {
            return "dark:!bg-gray-700";
          },
          multiValueLabel: () => {
            return "dark:text-white dark:bg-gray-700 rounded-md";
          },
        }}
        classNamePrefix="select"
      />
    </div>
  );
};

export default TagInput;
