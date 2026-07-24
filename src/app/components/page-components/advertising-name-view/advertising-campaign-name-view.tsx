import { AdvertisingTitlesEnum } from '@/enums/advertising.enums';
import { TargetingTypeEnum } from '@/enums/walmart.enums';
import { INudgeMessage } from '@/interfaces/column.interface';
import { Nullable } from '@/interfaces/index.interface';
import { BellIcon } from '@phosphor-icons/react';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'src/redux/hooks';
import {
  selectAdvertisingHeaderFilters,
  selectSelectedAdvertisingNavTitle,
} from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import { getToastStyle, getUrlWithQuery } from 'src/utils';
import {
  getAdTypePath,
  getCampaignUrl,
  getIsTaggingEditable,
  getMarketplacePath,
  getNudgeNotificationTitle,
} from 'src/utils/advertising.utils';
import ColumnTags from '../../common/column-tags/column-tags';
import { textWrappingStyles } from '../../common/keyword-actions-table/keyword-actions-table-styles';
import PrimaryButton from '../../common/primary-button/primary-button';
import styles from './advertising-name-view.module.scss';

interface IAdvertisingCampaignNameViewProps {
  campaignId: string;
  campaignName: string;
  messages?: INudgeMessage[] | null;
  formattedPathName?: string;
  adType: string | undefined;
  targetingType: string | undefined;
  tagId: Nullable<string>;
  handleTagUpdateLogic?: (updatedValue: string | null) => void;
  handleTableUpdateTagDelete?: (tagId: string) => void;
}

export default function AdvertisingCampaignNameView({
  campaignId,
  campaignName,
  messages,
  formattedPathName,
  adType,
  targetingType,
  tagId,
  handleTagUpdateLogic,
  handleTableUpdateTagDelete,
}: IAdvertisingCampaignNameViewProps) {
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const totalCount = messages ? messages.length : 0;
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [isBellVisible, setIsBellVisible] = useState<boolean>(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const selectedMarketplace = useMemo(
    () => advertisingAccount.marketplace as string,
    [advertisingAccount.marketplace]
  );

  const POP_OVER_EVENT = 'popover-open';

  const goToNext = () => {
    const nextIndex = (activeIndex + 1) % totalCount;
    setActiveIndex(nextIndex);
  };

  const goToPrevious = () => {
    const prevIndex = activeIndex === 0 ? totalCount - 1 : activeIndex - 1;
    setActiveIndex(prevIndex);
  };

  useEffect(() => {
    const onOther = (e: CustomEvent<string>) => {
      if (e.detail !== campaignId) setIsPopoverOpen(false);
    };
    window.addEventListener(POP_OVER_EVENT, onOther as EventListener);
    return () => {
      window.removeEventListener(POP_OVER_EVENT, onOther as EventListener);
    };
  }, [campaignId]);

  useEffect(() => {
    if (!bellRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsBellVisible(true);
          } else {
            setIsBellVisible(false);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1,
      }
    );

    observer.observe(bellRef.current);

    return () => {
      observer.disconnect();
    };
  }, [bellRef]);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={tableContainerRef}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        overflow: 'visible',
      }}
    >
      <div className={styles.infoDiv}>
        <Link
          className={styles.titleContainer}
          to={
            formattedPathName ??
            getUrlWithQuery(
              getCampaignUrl(
                campaignId,
                getAdTypePath(advHeaderFilters.adType.value),
                getMarketplacePath(selectedMarketplace)
              )
            )
          }
          style={{
            ...textWrappingStyles,
            textAlign: 'left',
            color: '#77469B',
          }}
        >
          <p className={styles.titleName} title={campaignName}>
            {campaignName}
          </p>
        </Link>

        <ColumnTags
          tagArray={[targetingType || TargetingTypeEnum.MANUAL, adType]}
          isTaggingRequired={true}
          isTaggingEditable={getIsTaggingEditable(
            selectedAdvertisingNavTitle as AdvertisingTitlesEnum
          )}
          tagId={tagId}
          handleTagUpdateLogic={handleTagUpdateLogic}
          handleTableUpdateTagDelete={handleTableUpdateTagDelete}
        />
      </div>

      {messages != null && messages.length > 0 && (
        <Popover
          open={isBellVisible && isPopoverOpen}
          onOpenChange={(open) => {
            setIsPopoverOpen(open);
            if (open) {
              window.dispatchEvent(
                new CustomEvent(POP_OVER_EVENT, { detail: campaignId })
              );
            }
          }}
        >
          <PopoverTrigger asChild>
            <div
              ref={bellRef}
              style={{
                border: '1px solid #DADEEB',
                borderRadius: '0.4rem',
                padding: '0.4rem',
                cursor: 'pointer',
                background: 'white',
                display: 'inline-block',
                overflow: 'visible',
              }}
            >
              <BellIcon size="1.6rem" />
              <span
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '0.75rem',
                  width: '1.4rem',
                  height: '1.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#F26E77',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                }}
              >
                {messages.length}
              </span>
            </div>
          </PopoverTrigger>

          <PopoverPortal>
            <PopoverContent
              side="top"
              align="end"
              sideOffset={8}
              alignOffset={0}
              sticky="partial"
              style={{
                zIndex: 3,
                width: '22rem',
                height: messages.length > 1 ? '11.5rem' : '9rem',
                background: '#F4ECFF',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              {PopupComponent(messages, activeIndex, goToPrevious, goToNext)}
            </PopoverContent>
          </PopoverPortal>
        </Popover>
      )}
    </div>
  );
}

function PopupComponent(
  messages: INudgeMessage[],
  activeIndex: number,
  goToPrevious: () => void,
  goToNext: () => void
) {
  const item = messages[activeIndex];
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '22rem',
        height: '100%',
        padding: '1rem',
        ...getToastStyle(activeIndex, activeIndex),
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#77469B',
        }}
      >
        {getNudgeNotificationTitle(item.messageId)}
      </h3>

      <p
        style={{
          margin: '0.5rem 0',
          fontSize: '1.1rem',
          lineHeight: 1.4,
          color: '#533F7F',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          maxWidth: '20rem',
        }}
      >
        {item.message.join(' ')}
      </p>

      {messages.length > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginTop: 'auto',
          }}
        >
          <span
            style={{
              color: '#77469B',
              fontSize: '1rem',
              fontWeight: '700',
            }}
          >
            {activeIndex + 1}/{messages.length}
          </span>
          <span style={{ display: 'flex', gap: '1rem' }}>
            <PrimaryButton
              buttonText="Previous"
              buttonFunction={goToPrevious}
              disabled={false}
              height="1.8rem"
              fontSize="1rem"
            />
            <PrimaryButton
              buttonText="Next"
              buttonFunction={goToNext}
              disabled={false}
              height="1.8rem"
              fontSize="1rem"
            />
          </span>
        </div>
      )}
    </div>
  );
}
