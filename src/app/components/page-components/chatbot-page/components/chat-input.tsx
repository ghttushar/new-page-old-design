import CustomBadge from '@/app/components/common/custom-badge/custom-badge';
import OutlineInputWithEndButton from '@/app/components/common/outline-input-with-button/outline-input-with-end-button';
import { primaryColor } from '@/app/components/layout/side-bar/menu-item-component-styles';
import { JIVAViewTypeEnum } from '@/enums/chatbot.enums';
import { IJIVAInsights } from '@/interfaces/chatbot.interface';
import { padZeroToNumbers } from '@/utils';
import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import {
  ChatCircleDotsIcon,
  LightbulbIcon,
  PaperPlaneIcon,
  StopCircleIcon,
} from '@phosphor-icons/react';
import React from 'react';
import { bulbIconBadgeStyles } from '../chatbot-page-styles';
import styles from './chat-input.module.scss';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  isLoading: boolean;
  hasAdvertisingAccounts: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  insightsData?: IJIVAInsights[];
  viewType?: JIVAViewTypeEnum;
  toggleView?: (() => void) | undefined;
  isExpanded?: boolean;
  hasReadInsights?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onStop,
  isLoading,
  hasAdvertisingAccounts,
  isDisabled = false,
  placeholder = 'Ask JIVA anything...',
  hasReadInsights,
  insightsData,
  isExpanded,
  toggleView,
  viewType,
}) => {
  const isButtonDisabled = (!value.trim() && !isLoading) || isDisabled;

  return (
    <div className={styles.inputContainer}>
      {viewType === JIVAViewTypeEnum.CHATBOT && (
        <div className={styles.inputWrapper}>
          <OutlineInputWithEndButton
            value={value}
            onChangeCustom={onChange}
            onEnterPress={onSend}
            isEnterSubmitEnabled={true}
            isMultilineRequired={true}
            placeholder={placeholder}
            multilineMaxRows={4}
            isDisabled={!hasAdvertisingAccounts}
          />

          <span
            className={`${styles.sendButton} ${
              isButtonDisabled ? styles.disabled : ''
            } ${isLoading ? styles.loading : ''}`}
            onClick={onSend}
          >
            {isLoading ? (
              <React.Fragment>
                <CircularProgress
                  size={'2rem'}
                  onClick={onStop}
                  sx={{
                    position: 'absolute',
                    color: primaryColor,
                  }}
                />
                <StopCircleIcon
                  size={'2rem'}
                  weight="fill"
                  color={primaryColor}
                />
              </React.Fragment>
            ) : (
              <PaperPlaneIcon
                weight="fill"
                size={'2rem'}
                className={styles.sendButtonIcon}
              />
            )}
          </span>
        </div>
      )}
      {insightsData &&
        viewType &&
        toggleView !== undefined &&
        isExpanded !== undefined &&
        hasReadInsights !== undefined &&
        InsightIcon(
          insightsData,
          viewType,
          toggleView,
          isExpanded,
          hasReadInsights
        )}
    </div>
  );
};

const InsightIcon = (
  insightsData: IJIVAInsights[],
  viewType: JIVAViewTypeEnum,
  toggleView: (() => void) | undefined,
  isExpanded: boolean,
  hasReadInsights: boolean
) => {
  const showChatbot = viewType === JIVAViewTypeEnum.CHATBOT;
  if (!insightsData || insightsData.length === 0) return null;

  return (
    <div
      className={styles.insightIconWrapper}
      style={{
        marginBottom: isExpanded ? '1rem' : '2rem',
        marginRight: '0',
        right: '-0rem',
      }}
    >
      <CustomBadge
        badgeContent={
          showChatbot && !hasReadInsights
            ? padZeroToNumbers(insightsData.length)
            : ''
        }
        minWidth="0"
        customBadgeStyles={bulbIconBadgeStyles}
        className={styles.insightsIconStyles}
      >
        <span
          className={styles.iconWrapper}
          onClick={toggleView}
          style={{
            cursor: 'pointer',
            marginRight: showChatbot ? '' : '1rem',
          }}
        >
          {showChatbot ? (
            <LightbulbIcon
              size="2rem"
              weight="fill"
              className={styles.iconStyles}
            />
          ) : (
            <ChatCircleDotsIcon
              size="2rem"
              weight="fill"
              className={styles.iconStyles}
            />
          )}
        </span>
      </CustomBadge>
    </div>
  );
};
