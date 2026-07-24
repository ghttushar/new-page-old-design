import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ICronDefinition } from '@/interfaces/cron/cron-definitions.interface';
import { DotsThreeOutlineVerticalIcon } from '@phosphor-icons/react';
import { useRef } from 'react';
import styles from './cron-definitions-table-actions.module.scss';

interface ICronDefinitionsTableActionsProps {
  definition: ICronDefinition;
  onView: (definition: ICronDefinition) => void;
  onEdit: (definition: ICronDefinition) => void;
  onToggleStatus: (definition: ICronDefinition) => void;
}

export default function CronDefinitionsTableActions({
  definition,
  onView,
  onEdit,
  onToggleStatus,
}: ICronDefinitionsTableActionsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleView = () => {
    onView(definition);
  };
  const handleEdit = () => {
    onEdit(definition);
  };

  const handleToggleStatus = () => {
    onToggleStatus(definition);
  };

  return (
    <div className={styles.actionContainer} ref={containerRef}>
      <Popover>
        <PopoverTrigger>
          <div className={styles.actionIcon}>
            <DotsThreeOutlineVerticalIcon
              size={'1.5rem'}
              color="#77469B"
              weight="fill"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          style={{
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
          }}
          align="start"
          alignOffset={-10}
          side="right"
          sideOffset={2}
        >
          <div className={styles.optionsContainer}>
            <div className={styles.option} onClick={handleView}>
              <span>View</span>
            </div>
            <div className={styles.option} onClick={handleEdit}>
              <span>Edit</span>
            </div>
            <div className={styles.option} onClick={handleToggleStatus}>
              <span>{definition.enabled ? 'Disable' : 'Enable'}</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
