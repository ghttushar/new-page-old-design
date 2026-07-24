import { FeedBackEnum } from '@/enums/chatbot.enums';
import { IFeedBackPayload } from '@/interfaces/chatbot.interface';
import { useAppMutation } from '@/redux/react-query-hooks';
import chatbotServices from '@/services/bidder/llm-chatbot/chatbot.service';
import { debounce } from '@/utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { ThumbsDownIcon, ThumbsUpIcon } from '@phosphor-icons/react';
import { useCallback, useMemo } from 'react';
import { CopyToClipBoardIcon } from '../../common/copy-to-clipboard/copy-to-clipboard';
import HoverInfoTooltip from '../../common/hover-info-tooltip/hover-info-tooltip';

interface IChatbotFeedbackProps {
  messageID: string;
  sessionId: string;
  feedback: string | undefined;
  isCallCompleted: boolean;
  isChatbotLoading: boolean;
  isHistoryLoaded: boolean;
  hasContent: boolean;
  updateFeedback: (message_id: string, value: FeedBackEnum) => void;
  contentToCopy?: string;
}

const ChatbotFeedback = ({
  messageID,
  sessionId,
  feedback,
  isCallCompleted,
  isChatbotLoading,
  isHistoryLoaded,
  hasContent,
  updateFeedback,
  contentToCopy,
}: IChatbotFeedbackProps) => {
  const marketplace = localStorageUtils.getAdvertisingMarketplace();

  const { mutateAsync: postChatFeedBack } = useAppMutation({
    mutationFn: (payload: IFeedBackPayload) => {
      updateFeedback(payload.message_id, payload.feedback);
      return chatbotServices.postChatFeedBack(payload);
    },
  });

  const debouncedFeedbackCall = useCallback(
    (feedback: FeedBackEnum) => {
      postChatFeedBack({
        message_id: messageID,
        session_id: sessionId,
        feedback,
        marketplace,
      });
    },
    [messageID, sessionId, marketplace, postChatFeedBack]
  );

  const handleFeedBackClick = useMemo(
    () => debounce(debouncedFeedbackCall),
    [debouncedFeedbackCall]
  );

  const isUpSelected = useMemo(() => feedback === FeedBackEnum.UP, [feedback]);
  const isDownSelected = useMemo(
    () => feedback === FeedBackEnum.DOWN,
    [feedback]
  );

  return (
    <span
      className="flex gap-[0.4rem]"
      style={{
        visibility:
          isChatbotLoading && !isCallCompleted
            ? 'hidden'
            : isHistoryLoaded || hasContent
            ? 'visible'
            : 'hidden',
      }}
    >
      <HoverInfoTooltip title={'Good Response'}>
        <ThumbsUpIcon
          size={'1.4rem'}
          onClick={() =>
            handleFeedBackClick(
              isUpSelected ? FeedBackEnum.NULL : FeedBackEnum.UP
            )
          }
          weight={isUpSelected ? 'fill' : 'regular'}
          color={isUpSelected ? '#77469b' : '#464646'}
          style={{
            cursor: 'pointer',
          }}
        />
      </HoverInfoTooltip>
      <HoverInfoTooltip title={'Bad Response'}>
        <ThumbsDownIcon
          size={'1.4rem'}
          color={isDownSelected ? '#77469b' : '#464646'}
          onClick={() =>
            handleFeedBackClick(
              isDownSelected ? FeedBackEnum.NULL : FeedBackEnum.DOWN
            )
          }
          weight={isDownSelected ? 'fill' : 'regular'}
          style={{
            cursor: 'pointer',
          }}
        />
      </HoverInfoTooltip>
      <CopyToClipBoardIcon contentToCopy={contentToCopy} />
    </span>
  );
};

export default ChatbotFeedback;
