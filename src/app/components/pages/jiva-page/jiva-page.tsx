import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import ChatbotHistory from '@/app/components/page-components/chatbot-page/chatbot-history/chatbot-history';
import { ChatInput } from '@/app/components/page-components/chatbot-page/components/chat-input';
import { ChatMessages } from '@/app/components/page-components/chatbot-page/components/chat-messages';
import { ChatWelcome } from '@/app/components/page-components/chatbot-page/components/chat-welcome';
import { SAMPLE_PROMPT_MAPPING } from '@/constants/chatbot.constants';
import { JIVAViewTypeEnum } from '@/enums/chatbot.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useChatbot } from '@/hooks/chatbot/use-chatbot';
import { useAuthSelector } from '@/redux/auth-selector/auth-selector';
import {
  resetChatbotState,
  selectIsHistorySideBarOpen,
  selectIsPreviewOpen,
  selectPreviewPanelUrl,
  setIsHistorySideBarOpen,
  setIsPreviewOpen,
} from '@/redux/chatbot/chatbot.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { resetAdvEditAccess } from '@/redux/slices/advertising/advertising-edit-access.slice';
import {
  resetAdvertisingHeaderOptions,
  resetPaginationModel,
} from '@/redux/slices/advertising/advertising-filter.slice';
import {
  selectAdvertisingAccount,
  selectAdvertisingAccountOptions,
  setIsSidebarMenuOpen,
} from '@/redux/slices/auth/auth.slice';
import chatbotUtils from '@/utils/chatbot.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import accountUtils from '@/utils/settings/accounts/account.utils';
import { useEffect, useMemo } from 'react';
import SubHeader from '../../common/sub-header/sub-header';
import ChatbotSidePanel from '../../page-components/chatbot-page/chatbot-side-panel';
import styles from './jiva-page.module.scss';

export default function JivaPage() {
  const {
    messages,
    sessions,
    activeSessionId,
    inputValue,
    isLoading,
    isHistoryLoading,
    user,
    hasAdvertisingAccounts,
    setInputValue,
    sendMessage,
    stopMessage,
    selectSession,
    startNewChat,
    updateFeedback,
  } = useChatbot({
    enableInsights: false,
    urlSync: true,
  });

  const isSidebarOpen = useAppSelector(selectIsHistorySideBarOpen);
  const isPreviewOpen = useAppSelector(selectIsPreviewOpen);
  const previewPanelUrl = useAppSelector(selectPreviewPanelUrl);
  const dispatch = useAppDispatch();
  const authSelector = useAuthSelector();
  const advertisingAccountOptions = useAppSelector(
    selectAdvertisingAccountOptions
  );
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [selectedAdvertisingAccount.marketplace]
  );

  const prompts = SAMPLE_PROMPT_MAPPING[marketplace];

  const closePreviewPanel = () => dispatch(setIsPreviewOpen(false));

  const handleSetAdsAccount = (account: IDropdownItem<string>) => {
    authSelector.setAdvertisingAccount(account);

    dispatch(resetPaginationModel());
    dispatch(resetChatbotState());
    dispatch(resetAdvEditAccess());
    dispatch(resetAdvertisingHeaderOptions());
    chatbotUtils.newSession();
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const messageText = inputValue.trim();
    setInputValue('');
    await sendMessage(messageText);
  };

  const handleSelectPrompt = async (prompt: string) => {
    await sendMessage(prompt);
  };

  const hasAccounts = !!localStorageUtils.getAvailableAccounts().length;

  useEffect(() => {
    dispatch(setIsSidebarMenuOpen(false));
    dispatch(setIsHistorySideBarOpen(true));
  }, [dispatch]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        {hasAccounts === true && (
          <div
            className={`${styles.sidebar} ${
              !isSidebarOpen ? styles.collapsed : ''
            }`}
          >
            <ChatbotHistory
              newChatHandler={startNewChat}
              selectedHistoryId={activeSessionId}
              handleHistoryTabClick={selectSession}
              width="26rem"
            />
          </div>
        )}

        <div
          className={styles.mainContent}
          style={{ flexDirection: 'row', alignItems: 'stretch' }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              overflow: 'hidden',
              minWidth: 0,
              height: '100%',
            }}
          >
            <SubHeader
              title={'JIVA'}
              titleTooltip={''}
              isDropdownRequired={true}
              backgroundColor="white"
              dropdownOptions={[
                {
                  label: 'Marketplace',
                  selectedItem: selectedAdvertisingAccount,
                  setSelectedItem: handleSetAdsAccount,
                  options: accountUtils.getAdsAccountOptionsByTitle(
                    '',
                    advertisingAccountOptions
                  ),
                  prefixElement: selectedAdvertisingAccount.prefixElement,
                  flagElement: selectedAdvertisingAccount.flagElement,
                },
              ]}
            />
            <div className={styles.chatArea}>
              {messages.length === 0 && isHistoryLoading === false ? (
                <ChatWelcome
                  user={user}
                  hasAdvertisingAccounts={hasAdvertisingAccounts}
                  samplePrompts={prompts}
                  onSelectPrompt={handleSelectPrompt}
                  isExpanded={true}
                />
              ) : (
                <ChatMessages
                  messages={messages}
                  isLoading={isHistoryLoading}
                  isExpanded={true}
                  isHistorySession={false}
                  sessionId={activeSessionId}
                  isChatbotLoading={isLoading}
                  updateFeedback={updateFeedback}
                  sendUserMessage={sendMessage}
                  isSidePanelOpen={isPreviewOpen}
                />
              )}
            </div>

            <div
              className={styles.inputArea}
              style={{
                width: isPreviewOpen ? '95%' : '70%',
              }}
            >
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSend}
                onStop={stopMessage}
                isLoading={isLoading}
                hasAdvertisingAccounts={hasAdvertisingAccounts}
                placeholder="Ask JIVA anything..."
                viewType={JIVAViewTypeEnum.CHATBOT}
              />
            </div>
          </div>

          <ChatbotSidePanel
            isOpen={isPreviewOpen}
            onClose={closePreviewPanel}
            title="Report Preview"
            width="50%"
            url={previewPanelUrl}
          >
            {previewPanelUrl && (
              <iframe
                src={previewPanelUrl}
                title="Report Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  background: '#fff',
                }}
                sandbox="allow-scripts allow-same-origin"
              />
            )}
          </ChatbotSidePanel>
        </div>
      </div>
    </div>
  );
}
