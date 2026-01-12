import React from 'react';

interface DatePickerInputProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Select date" 
}) => {
  return (
    <input
      type="date"
      value={value}
      onChange={(e: any) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="bg-black text-white border border-neutral-500/30 rounded-lg p-2 cursor-pointer"
    />
  );
};

export default DatePickerInput;