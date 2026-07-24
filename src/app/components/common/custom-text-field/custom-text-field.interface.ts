import { type NumericFormatProps } from 'react-number-format';

export interface CustomNumberFieldChangeEvent {
  target: {
    name?: string;
    value: string;
    valueAsNumber: number;
  };
}

export type CustomNumberFieldProps = Omit<NumericFormatProps, 'onChange'> & {
  onChange?: (event: CustomNumberFieldChangeEvent) => void;
  ownerState?: unknown;
};
