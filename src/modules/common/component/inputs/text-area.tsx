/* eslint-disable @typescript-eslint/unbound-method */
import React from "react";

interface IProps {
  label: string;
  placeholder: string;
  value?: string | number;
  id: string;
  name: string;
  onChange?(event: React.FormEvent<HTMLTextAreaElement>): void;
}

const TextArea = (props: IProps) => {
  const { label, placeholder, value, id, name, onChange } = props;
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-sm font-semibold text-[#1F1F1F] ">
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        id={id}
        name={name}
        className=""
        onChange={onChange}
      />
    </div>
  );
};

export default TextArea;
