import TextButton from '@/app/components/common/text-button/text-button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MonitoringMetaDataTypeEnum } from '@/enums/monitoring.enum';
import { getTitleCaseString } from '@/utils';
import { monitoringUtils } from '@/utils/monitoring.utils';
import { useState } from 'react';

interface PayloadProps {
  payload: Readonly<JSON>;
  text?: string;
}
function MonitoringPayloadPopup(props: PayloadProps) {
  const { payload, text = 'Payload' } = props;
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <div>
      <Popover open={isOpen} onOpenChange={togglePopup}>
        <PopoverTrigger>
          <TextButton
            label={getTitleCaseString(text)}
            handleClick={togglePopup}
            customStyles={{
              color: isOpen
                ? 'grey'
                : text === 'Payload'
                ? '#77469b'
                : monitoringUtils.getMetaDataColor(
                    text as MonitoringMetaDataTypeEnum
                  ),
            }}
          />
        </PopoverTrigger>
        <PopoverContent
          side={'left'}
          align={'center'}
          style={{
            overflow: 'auto',
            maxHeight: '30rem',
            width: '100%',
            maxWidth: '50rem',
            fontWeight: '600',
            fontSize: '1.1rem',
            wordBreak: 'break-all',
          }}
        >
          <div>
            <pre>{JSON.stringify(payload, null, 2)}</pre>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default MonitoringPayloadPopup;
