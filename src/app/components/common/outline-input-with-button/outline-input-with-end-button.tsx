import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import React, { useMemo, useState } from 'react';
import { outlineInputNewStyles } from './outline-input-with-button-styles';
interface IOutlineInputWithButtonProps {
  value?: string;
  suggestedPrompt?: string;
  onChangeCustom: (value: string) => void;
  onEnterPress?: (value: string) => void;
  isEnterSubmitEnabled?: boolean;
  isMultilineRequired: boolean;
  multilineMaxRows?: number;
  endButton?: JSX.Element;
  placeholder: string;
  width?: string;
  height?: string;
  fontWeight?: string | number;
  fontSize?: string;
  background?: string;
  fontColor?: string;
  isDisabled?: boolean;
}

export default function OutlineInputWithEndButton({
  value,
  suggestedPrompt,
  onChangeCustom,
  onEnterPress,
  isEnterSubmitEnabled = false,
  isMultilineRequired,
  multilineMaxRows = 3,
  endButton,
  placeholder,
  width = '100%',
  height = 'auto',
  fontWeight = 400,
  fontSize = '1.2rem',
  background = '#ffffff',
  fontColor = '#676F7E',
  isDisabled = false,
}: IOutlineInputWithButtonProps) {
  const [inputValue, setInputValue] = useState<string>('');

  const newValue = useMemo(
    () => value ?? suggestedPrompt ?? inputValue,
    [value, suggestedPrompt, inputValue]
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const textarea = event.target;
    const nextValue = textarea.value;
    setInputValue(nextValue);
    onChangeCustom(nextValue);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter' && isEnterSubmitEnabled && !e.shiftKey) {
      e.preventDefault();
      const currentInputValue = e.currentTarget.value;
      onChangeCustom(currentInputValue);
      onEnterPress?.(currentInputValue);
    }
  };

  return (
    <OutlinedInput
      type="text"
      multiline={isMultilineRequired}
      minRows={1}
      maxRows={multilineMaxRows}
      onChange={handleChange}
      value={newValue}
      placeholder={placeholder}
      disabled={isDisabled}
      onKeyDown={handleKeyDown}
      endAdornment={
        endButton ? (
          <InputAdornment position="end">{endButton}</InputAdornment>
        ) : undefined
      }
      sx={{
        ...outlineInputNewStyles,
        width: width,
        height: height,
        background: background,
        fontWeight: fontWeight,
        fontSize: fontSize,
        color: fontColor,
      }}
    />
  );
}
