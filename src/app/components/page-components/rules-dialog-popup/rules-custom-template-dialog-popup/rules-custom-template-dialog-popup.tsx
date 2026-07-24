import { outlineInputNewStyles } from '@/app/components/common/outline-input-with-button/outline-input-with-button-styles';
import { OutlinedInput } from '@mui/material';
import { useMemo, useState } from 'react';
import styles from './rules-custom-template-dialog-popup.module.scss';

interface IRulesCustomTemplateDialogPopupProps {
  currReqValue: string;
  onCustomReqValueChange: (value: string) => void;
}

export default function RulesCustomTemplateDialogPopup({
  currReqValue,
  onCustomReqValueChange,
}: IRulesCustomTemplateDialogPopupProps) {
  const [value, setValue] = useState<string>('');

  const newValue = useMemo(() => currReqValue ?? value, [currReqValue, value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const textarea = event.target;
    const value = textarea.value;
    setValue(value);
    onCustomReqValueChange(value);
  };

  return (
    <div className={styles.customPopupContainer}>
      <p className={styles.customPopupDescription}>
        Share what you're trying to achieve, and we’ll customize the template to
        fit your needs.
      </p>

      <OutlinedInput
        type="text"
        multiline
        rows={5}
        onChange={handleChange}
        value={newValue}
        placeholder="You want to achieve..."
        sx={{
          ...outlineInputNewStyles,
          width: '100%',
          background: '#fdfdfd',
          border: '1px solid #dadeeb',
          fontWeight: 400,
          fontSize: '1.2rem',
        }}
      />
    </div>
  );
}
