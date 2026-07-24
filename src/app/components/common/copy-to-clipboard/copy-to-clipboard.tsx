import { TooltipPlacement } from '@/enums/tooltip-texts.enums';
import { checkIsNull } from '@/utils/advertising.utils';
import { CheckIcon, CopyIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import HoverInfoTooltip from '../hover-info-tooltip/hover-info-tooltip';
export interface ICopyToClipboardProps {
  contentToCopy: string | undefined;
}
export const CopyToClipBoardIcon = ({
  contentToCopy,
}: ICopyToClipboardProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCopyDisabled = checkIsNull(contentToCopy) || isCopied;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copyToClipboard = async () => {
    if (isCopyDisabled) return;
    if (!navigator.clipboard?.writeText) return;
    if (!contentToCopy) return;
    try {
      await navigator.clipboard.writeText(contentToCopy);
      setIsCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsCopied(false), 1000);
    } catch {}
  };
  return (
    <div>
      <HoverInfoTooltip
        title={isCopied ? '' : 'Copy'}
        position={TooltipPlacement.Bottom}
      >
        <span>
          <button
            type="button"
            onClick={copyToClipboard}
            disabled={isCopyDisabled}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: isCopyDisabled ? 'not-allowed' : 'pointer',
            }}
          >
            {isCopied ? (
              <CheckIcon size={'1.4rem'} color="#464646" weight="bold" />
            ) : (
              <CopyIcon size={'1.4rem'} color="#464646" />
            )}
          </button>
        </span>
      </HoverInfoTooltip>
    </div>
  );
};
