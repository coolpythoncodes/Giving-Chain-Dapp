import React from "react";
import { Select } from 'antd';

export interface OptionsInterface {
    name: string;
    value: string;
    id: number;
  }

interface IProps {
  label?: string;
  placeHolder?: string;
  options: OptionsInterface[];
  onChange?: (value: string) => void;
  value?: string;
  id?: string;
  defaultValue?: string;
  disabled?: boolean;
}

const Dropdown = (props: IProps) => {
  const {
    label,
    options,
    onChange,
    placeHolder,
    value,
    id,
    defaultValue,
    disabled,
  } = props;
  const { Option } = Select;
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="font-semibold text-sm text-[#1F1F1F] ">{label}</label>
      <Select
        placeholder={placeHolder}
        onChange={onChange}
        value={value}
        id={id}
        defaultValue={defaultValue}
        disabled={disabled}
      >
        {options.map((opt) => {
          return (
            <Option key={opt.id} value={opt.value}>
              {opt.name}
            </Option>
          );
        })}
      </Select>
    </div>
  );
};

export default Dropdown;
