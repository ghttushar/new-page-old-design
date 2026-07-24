import ImgComponent from '@/app/components/common/img-component/img-component';
import { useState } from 'react';
import { IThreadData } from 'src/app/components/pages/amc-page/amc-report-page/amc-report-page';

import { imageUrls } from '@/constants/assets/images.constants';
import { IPrompt } from 'src/interfaces/amc.interfaces';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectConversations,
  selectIsConversationLoading,
  setConversations,
  setIsConversationLoading,
} from 'src/redux/slices/amc/amc.slice';
import { selectUser } from 'src/redux/slices/auth/auth.slice';
import AMCGPTServices from 'src/services/amc/amc-gpt.services';
import {
  appendGPTPrompt,
  getPromptByTitle,
  replaceGPTResponseToBuiltInPrompt,
} from 'src/utils/amc.utils';
import styles from './gpt-chat-modal.module.scss';
import { ChatWrapper } from './gpt-chat-wrapper';
import { wrapperStyle } from './gpt-modal.styles';

interface GPTChatModelProps {
  onBackdropClick: () => void;
  builtInPrompts: IPrompt[];
  assistantId: string;
  threadData: IThreadData | null;
  isCreatingThread: boolean;
}
export const GPTChatModel: React.FC<GPTChatModelProps> = ({
  onBackdropClick,
  builtInPrompts,
  assistantId,
  threadData,
  isCreatingThread,
}) => {
  const [initialState, setInitialState] = useState(true);
  const [viewAll, setViewAll] = useState(false);
  const user = useAppSelector(selectUser);
  const conversations = useAppSelector(selectConversations);
  const loading = useAppSelector(selectIsConversationLoading);
  const dispatch = useAppDispatch();

  const handleModalContainerClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
  };

  const handlePromptClick = (title: string) => {
    if (!threadData) return;
    dispatch(setIsConversationLoading(true));
    setInitialState(false);
    setViewAll(false);
    const prompt = getPromptByTitle(title, builtInPrompts);
    dispatch(
      setConversations(
        appendGPTPrompt(title, conversations, threadData, assistantId)
      )
    );
    const body = {
      fileId: threadData.fileId,
      threadId: threadData.threadId,
      assistantId,
      prompt: prompt?.description || '',
    };
    AMCGPTServices.analysePrompt(body)
      .then((res) => {
        const response = res.data.data.reverse();
        const updatedData = replaceGPTResponseToBuiltInPrompt(
          response,
          builtInPrompts
        );
        dispatch(setConversations(updatedData));
      })
      .finally(() => {
        dispatch(setIsConversationLoading(false));
      });
  };

  const viewAllPrompts = () => {
    setViewAll(!viewAll);
  };
  if (isCreatingThread)
    return (
      <div className={styles.modalBackdrop} onClick={() => onBackdropClick()}>
        <div
          className={styles.modalContainer}
          onClick={handleModalContainerClick}
        >
          <div className={styles.initialState}>
            <ImgComponent
              imageURL={imageUrls.anarixLogoLarge}
              alt="logo"
              customStyles={{
                height: '15rem',
                width: '15rem',
                marginBottom: '-3rem',
              }}
            />
            <p className={styles.initialText}>Anarix GPT</p>
            <p className={styles.initialText}>
              One moment! Setting things up..
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className={styles.modalBackdrop} onClick={() => onBackdropClick()}>
      <div
        className={styles.modalContainer}
        onClick={handleModalContainerClick}
      >
        {initialState && conversations.length === 0 ? (
          <div className={styles.initialState}>
            <ImgComponent
              imageURL={imageUrls.anarixLogoLarge}
              alt="logo"
              customStyles={{
                height: '15rem',
                width: '15rem',
                marginBottom: '-3rem',
              }}
            />
            <p className={styles.initialText}>Anarix GPT</p>
            <p className={styles.initialText}>How can I help you?</p>
          </div>
        ) : (
          <div className={styles.chatContainer}>
            <div className={styles.chatContainerHeader}>
              <ImgComponent imageURL={imageUrls.anarixLogo} alt="logo" />
            </div>
            <ChatWrapper user={user} />
          </div>
        )}
        <div
          className={`${viewAll ? styles.expand : styles.collapse}`}
          style={wrapperStyle}
        >
          {loading && <div className={styles.overlay}></div>}
          <div className={styles.viewAll} onClick={viewAllPrompts}>
            {viewAll ? 'Collapse' : 'Expand'}
          </div>
          <div className={styles.promptWrapper}>
            {builtInPrompts.length < 0 && <p>GPT is not Configured</p>}
            {builtInPrompts.map((prompt, index) => {
              return (
                <div
                  className={styles.promptContainer}
                  style={loading ? { pointerEvents: 'none' } : {}}
                  key={`${prompt.title}-${index}`}
                  onClick={() => {
                    if (!loading) handlePromptClick(prompt.title);
                  }}
                >
                  <p className={styles.promptText}>{prompt.title}</p>
                </div>
              );
            })}
          </div>
          <p
            className={styles.footerText}
            style={{
              marginTop: '1rem',
              color: '#bfbfbf',
            }}
          >
            The answers or recommendations provided are generated<br></br>by GPT
            and not by Anarix experts.
          </p>
          <p className={styles.footerText}>
            Integrated with <span>ChatGPT</span>
          </p>
        </div>
      </div>
    </div>
  );
};
