import { forwardRef } from 'react';
import { NumericFormat } from 'react-number-format';
import { CustomNumberFieldProps } from './custom-text-field.interface';

export const CustomNumberFieldComponent = forwardRef<
  HTMLInputElement,
  CustomNumberFieldProps
>(function CustomNumberFieldComponent(props, ref) {
  const { onChange, getInputRef, onValueChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      onValueChange={(values, sourceInfo) => {
        onValueChange?.(values, sourceInfo);

        if (sourceInfo.source !== 'event') return;

        onChange?.({
          target: {
            name: props.name,
            value: values.value,
            valueAsNumber: values.floatValue ?? NaN,
          },
        });
      }}
    />
  );
});
