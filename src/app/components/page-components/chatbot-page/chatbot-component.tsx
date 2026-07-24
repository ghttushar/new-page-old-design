import { INSIGHTS_TABS } from '@/constants/chatbot.constants';
import { JIVAViewTypeEnum } from '@/enums/chatbot.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useChatbot } from '@/hooks/chatbot/use-chatbot';
import { IInsightsAction, IJIVAInsights } from '@/interfaces/chatbot.interface';
import {
  removeInsight,
  selectActiveSessionId,
  selectActiveSessionMessages,
  selectInsightsData,
  selectIsHistorySideBarOpen,
  selectIsPreviewOpen,
  selectPreviewPanelUrl,
  selectViewType,
  setActiveSession,
  setIsPreviewOpen,
  setViewType,
} from '@/redux/chatbot/chatbot.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectAdvertisingAccount,
  selectUser,
  setIsChatbotOpen,
} from '@/redux/slices/auth/auth.slice';
import {
  selectRuleTypeTemplates,
  selectSelectedRuleType,
} from '@/redux/slices/rules/rules.slice';
import chatbotUtils from '@/utils/chatbot.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import Dialog from '@mui/material/Dialog';
import {
  ArrowsInSimpleIcon,
  BroomIcon,
  MinusIcon,
  XIcon,
} from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TabItemWithIcon from '../../common/tabs-with-icon/tabs-with-icon';
import CustomEditLoader from '../../shared/custom-edit-loader/custom-edit-loader';
import ChatbotHistory from './chatbot-history/chatbot-history';
import {
  containerStyles,
  insightTabStyles,
  subContainerStyles,
} from './chatbot-page-styles';
import styles from './chatbot-page.module.scss';
import ChatbotSidePanel from './chatbot-side-panel';
import { ChatInput } from './components/chat-input';
import { ChatMessages } from './components/chat-messages';
import { ChatWelcome } from './components/chat-welcome';
import InsightCard from './insight-card';
import RulesJivaInsights from './rules-jiva-insights';

interface IChatBotProps {
  samplePrompts: string[];
  isDisabled?: boolean;
  open: boolean;
  handlePopupClose: () => void;
  isExpanded: boolean;
  clearSearchEvent: string;
  handlePopupMinimize: () => void;
}

export default function ChatbotComponent({
  samplePrompts,
  isDisabled = false,
  open,
  handlePopupClose,
  isExpanded,
  clearSearchEvent,
  handlePopupMinimize,
}: IChatBotProps) {
  const hasAdvertisingAccounts = !!localStorageUtils
    .getAvailableAccounts()
    .filter((acct) => acct?.advertising).length;
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const selectedHistoryId = useAppSelector(selectActiveSessionId);
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const insightsData = useAppSelector(selectInsightsData).filter(
    (insight) => (insight?.summary || '').toString().trim().length > 0
  );
  const mid = Math.ceil(insightsData.length / 2);
  const leftInsights = insightsData.slice(0, mid);
  const rightInsights = insightsData.slice(mid);
  const isInsightLoading = queryClient.isFetching({
    queryKey: [QueryKeyEnums.INSIGHTS_FETCH],
  });

  // Rules-specific selectors
  const location = useLocation();
  const ruleTemplates = useAppSelector(selectRuleTypeTemplates);
  const selectedRuleType = useAppSelector(selectSelectedRuleType);

  // Detect if we're on the rules page
  const isOnRulesPage = chatbotUtils.isOnRulesPage(location.pathname);
  const isRulesFormPage = chatbotUtils.isRulesFormPage(location.pathname);

  const isSidebarOpen = useAppSelector(selectIsHistorySideBarOpen);

  const isPreviewOpen = useAppSelector(selectIsPreviewOpen);
  const previewPanelUrl = useAppSelector(selectPreviewPanelUrl);
  const [activeInsightIndex, setActiveInsightIndex] = useState<number | null>(
    null
  );
  const [leftActiveIndex, setLeftActiveIndex] = useState<number | null>(null);
  const [rightActiveIndex, setRightActiveIndex] = useState<number | null>(null);
  const [hasReadInsights, setHasReadInsights] = useState(false);

  const viewType = useAppSelector(selectViewType);
  const historyChatData = useAppSelector(selectActiveSessionMessages);

  // Use the working chatbot hook
  const {
    messages,
    sessions,
    activeSessionId,
    inputValue,
    isLoading: isChatbotLoading,
    isHistoryLoading,
    samplePrompts: hookSamplePrompts,
    setInputValue,
    sendMessage,
    stopMessage,
    selectSession,
    startNewChat,
    toggleView: hookToggleView,
    updateFeedback,
    handleInsightChat: hookHandleInsightChat,
    handleInsightAction: hookHandleInsightAction,
  } = useChatbot({
    enableInsights: true,
    urlSync: false,
  });

  const toggleView = () => {
    const newView =
      viewType === JIVAViewTypeEnum.CHATBOT
        ? JIVAViewTypeEnum.INSIGHTS
        : JIVAViewTypeEnum.CHATBOT;

    dispatch(setViewType(newView));

    if (newView === JIVAViewTypeEnum.INSIGHTS) {
      setHasReadInsights(true);
    }
  };

  const handleApplyTemplate = (templateId: string) => {
    // TODO: Add logic to apply the template
  };

  const marketplace =
    selectedAdvertisingAccount.marketplace ?? MarketplaceEnum.AMAZON;

  const setSelectedHistoryId = (id: string) => {
    dispatch(setActiveSession(id));
  };

  const handleHistoryTabClick = (id: string) => {
    if (selectedHistoryId !== '' && selectedHistoryId === id) return;
    setSelectedHistoryId(id);
    if (viewType === JIVAViewTypeEnum.INSIGHTS) {
      dispatch(setViewType(JIVAViewTypeEnum.CHATBOT));
    }
  };

  const handleSend = async () => {
    if (isChatbotLoading) {
      return;
    }

    if (inputValue.trim() === '') return;

    const messageText = inputValue.trim();
    setInputValue('');
    await sendMessage(messageText);
  };

  const clearAll = () => {
    startNewChat();
    setHasReadInsights(false);
    dispatch(setViewType(JIVAViewTypeEnum.CHATBOT));
  };

  useEffect(() => {
    if (clearSearchEvent) {
      window.addEventListener(clearSearchEvent, clearAll);
      return () => {
        window.removeEventListener(clearSearchEvent, clearAll);
      };
    }
  }, [clearSearchEvent]);

  const handleInsightChat = (insight: IJIVAInsights) => {
    hookHandleInsightChat(insight);
    dispatch(setViewType(JIVAViewTypeEnum.CHATBOT));
  };

  const handleInsightAction = (
    insight: IJIVAInsights,
    action: IInsightsAction,
    jivaText: string
  ) => {
    dispatch(setIsChatbotOpen(true));
    hookHandleInsightAction(insight, action, jivaText);
    dispatch(setViewType(JIVAViewTypeEnum.CHATBOT));
  };

  const handlePopulateInput = (text: string, insight: IJIVAInsights) => {
    setInputValue(text);
    if (viewType !== JIVAViewTypeEnum.CHATBOT) {
      dispatch(setViewType(JIVAViewTypeEnum.CHATBOT));
    }
    dispatch(setIsChatbotOpen(true));
    hookHandleInsightChat(insight);
  };

  const handleRemoveInsight = (index: number) => {
    dispatch(removeInsight(index));
  };

  const closeSidePanel = () => {
    dispatch(setIsPreviewOpen(false));
  };

  const sendUserMessage = async (message: string) => {
    await sendMessage(message);
  };

  const selectPrompt = async (prompt: string) => {
    setInputValue('');
    await sendMessage(prompt);
  };

  const InsightsComp = (
    insights: IJIVAInsights[],
    activeIndex: number | null,
    setActiveIndex: (index: number | null) => void
  ) => (
    <div
      style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '3rem',
      }}
    >
      {insights.map((insight, index) => (
        <InsightCard
          key={`${insight.title}-${index}`}
          index={index}
          insight={insight}
          marketplace={selectedAdvertisingAccount.marketplace}
          isExpanded={isExpanded}
          onChatClick={handleInsightChat}
          onActionClick={handleInsightAction}
          onPopulateInput={handlePopulateInput}
          onRemove={() => handleRemoveInsight(index)}
          sessionId={selectedHistoryId}
          messageId={activeSessionId}
          isActive={activeIndex === index}
          onToggle={() => {
            setActiveIndex(activeIndex === index ? null : index);
          }}
        />
      ))}
    </div>
  );

  const chatbotUI = (
    <div
      style={{
        opacity: isExpanded ? 1 : open ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        height: '100%',
      }}
    >
      <div
        className={styles.container}
        style={{
          position: isExpanded ? 'fixed' : 'initial',
          ...containerStyles(isExpanded),
        }}
      >
        {isExpanded === true && (
          <ChatbotHistory
            newChatHandler={startNewChat}
            selectedHistoryId={selectedHistoryId}
            handleHistoryTabClick={handleHistoryTabClick}
            width="20rem"
          />
        )}

        <div
          className={styles.subContainer}
          style={{
            ...subContainerStyles(isExpanded, isSidebarOpen),
            overflow: isExpanded ? 'hidden' : undefined,
            width: '100%',
          }}
        >
          {isExpanded === true && (
            <div
              style={{
                width: '100%',
                backgroundColor: 'white',
                borderRadius: '0 0.8rem 0 0',
                padding: '0.5rem 1rem',
                boxSizing: 'border-box',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                marginBottom: '0.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '2rem',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: '3.5rem',
                }}
              >
                <MinusIcon
                  size={'2rem'}
                  style={{ cursor: 'pointer', color: '#464646' }}
                  onClick={handlePopupMinimize}
                />
                <BroomIcon
                  size={'2rem'}
                  style={{ cursor: 'pointer', color: '#464646' }}
                  onClick={clearAll}
                />
                <ArrowsInSimpleIcon
                  size={'2rem'}
                  style={{ cursor: 'pointer', color: '#464646' }}
                  onClick={handlePopupMinimize}
                />
                <XIcon
                  size={'2rem'}
                  style={{ cursor: 'pointer', color: '#464646' }}
                  onClick={handlePopupClose}
                />
              </div>
            </div>
          )}
          {viewType === JIVAViewTypeEnum.INSIGHTS ? (
            isOnRulesPage ? (
              // Rules-specific insights view
              <div
                className={styles.insightsContainer}
                style={{
                  flexGrow: 1,
                  maxHeight: isExpanded
                    ? 'calc(100vh - 15rem)'
                    : 'calc(100vh - 10rem)',
                  position: 'relative',
                  zIndex: 0,
                  padding: 0,
                }}
              >
                <RulesJivaInsights
                  isExpanded={isExpanded}
                  selectedHistoryId={selectedHistoryId}
                  currQuesId={activeSessionId}
                  marketplace={marketplace}
                  onChatClick={handleInsightChat}
                  onActionClick={handleInsightAction}
                  onPopulateInput={handlePopulateInput}
                  onRemoveInsight={handleRemoveInsight}
                  onApplyTemplate={handleApplyTemplate}
                  showSuggestedTemplates={isRulesFormPage}
                  showAuditRule={isRulesFormPage}
                  ruleTemplates={ruleTemplates}
                />
              </div>
            ) : (
              // Default insights view
              <div
                className={styles.insightsContainer}
                style={{
                  flexGrow: 1,
                  maxHeight: isExpanded
                    ? 'calc(100vh - 15rem)'
                    : 'calc(100vh - 10rem)',
                  position: 'relative',
                  zIndex: 0,
                  width: '100%',
                }}
              >
                <span
                  className="w-full flex"
                  style={{
                    marginLeft: isExpanded ? '24.4rem' : undefined,
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    background: 'white',
                    paddingTop: isExpanded ? '1rem' : '2rem',
                    paddingBottom: isExpanded ? '1rem' : '1.5rem',
                    paddingRight: '1rem',
                    paddingLeft: isExpanded ? undefined : '2rem',
                    marginTop: 0,
                    boxShadow: isExpanded ? 'none' : 'none',
                    justifyContent: 'flex-start',
                  }}
                >
                  <TabItemWithIcon
                    tabs={INSIGHTS_TABS}
                    customStyles={insightTabStyles(isExpanded)}
                    handleTabSelect={() => {
                      //
                    }}
                  />
                </span>
                {isExpanded && !isPreviewOpen ? (
                  isInsightLoading ? (
                    <CustomEditLoader overlayText="Loading Insights..." />
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        gap: '3rem',
                        padding: '1rem 10rem',
                        alignItems: 'start',
                        justifyContent: 'center',
                        width: '100%',
                        position: 'relative',
                        overflow: 'auto',
                      }}
                    >
                      {InsightsComp(
                        leftInsights,
                        leftActiveIndex,
                        setLeftActiveIndex
                      )}
                      {InsightsComp(
                        rightInsights,
                        rightActiveIndex,
                        setRightActiveIndex
                      )}
                    </div>
                  )
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto',
                      gap: '3rem',
                      padding: '0rem 2rem 1rem 2rem',
                      alignItems: 'start',
                      maxWidth: '100%',
                      margin: '0',
                      width: '100%',
                      position: 'relative',
                      right: '0',
                      overflowY: 'auto',
                      overflowX: 'hidden',
                    }}
                  >
                    {insightsData?.length > 0 &&
                      insightsData.map((insight, index) => (
                        <InsightCard
                          key={`${insight.title}-${index}`}
                          index={index}
                          insight={insight}
                          marketplace={selectedAdvertisingAccount.marketplace}
                          isExpanded={isExpanded}
                          onChatClick={handleInsightChat}
                          onActionClick={handleInsightAction}
                          onPopulateInput={handlePopulateInput}
                          onRemove={handleRemoveInsight}
                          sessionId={selectedHistoryId}
                          messageId={activeSessionId}
                          isActive={activeInsightIndex === index}
                          onToggle={() =>
                            setActiveInsightIndex(
                              activeInsightIndex === index ? null : index
                            )
                          }
                        />
                      ))}
                  </div>
                )}
              </div>
            )
          ) : historyChatData.length > 0 || isHistoryLoading ? (
            <ChatMessages
              messages={historyChatData}
              isLoading={isHistoryLoading}
              isExpanded={isExpanded}
              isHistorySession={false}
              sessionId={selectedHistoryId}
              isChatbotLoading={isChatbotLoading}
              updateFeedback={updateFeedback}
              sendUserMessage={sendUserMessage}
              isSidePanelOpen={isPreviewOpen}
            />
          ) : (
            <ChatWelcome
              user={user}
              hasAdvertisingAccounts={hasAdvertisingAccounts}
              samplePrompts={samplePrompts}
              onSelectPrompt={selectPrompt}
              isExpanded={isExpanded}
            />
          )}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: isExpanded === false ? 'column' : 'initial',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {(viewType === JIVAViewTypeEnum.CHATBOT ||
              viewType === JIVAViewTypeEnum.INSIGHTS) && (
              <div
                className={styles.inputRectangleWrapper}
                style={{
                  boxShadow:
                    isExpanded || viewType !== JIVAViewTypeEnum.CHATBOT
                      ? ''
                      : '0 0 0.4rem 0 rgba(0,0,0,0.35)',
                  marginLeft: isExpanded ? '-2rem' : undefined,
                  height:
                    viewType === JIVAViewTypeEnum.INSIGHTS ? 0 : undefined,
                  padding:
                    viewType === JIVAViewTypeEnum.INSIGHTS ? 0 : undefined,
                  width: isExpanded ? (isPreviewOpen ? '90%' : '65%') : '100%',
                }}
              >
                <ChatInput
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={handleSend}
                  onStop={stopMessage}
                  isLoading={isChatbotLoading}
                  hasAdvertisingAccounts={hasAdvertisingAccounts}
                  hasReadInsights={hasReadInsights}
                  insightsData={insightsData}
                  isExpanded={isExpanded}
                  toggleView={toggleView}
                  viewType={viewType}
                />
              </div>
            )}
          </div>
        </div>
        {isExpanded ? (
          <div
            style={{
              width: isPreviewOpen ? '100%' : '',
              height: '100%',
              padding: '0 1.4rem 0 0',
            }}
          >
            {ChatbotPanelComp()}
          </div>
        ) : (
          <Dialog
            open={isPreviewOpen}
            sx={{
              '& .MuiDialog-paper': {
                minWidth: '60%',
                height: '100rem',
                borderRadius: '0.4rem',
              },
            }}
            fullWidth
          >
            {ChatbotPanelComp()}
          </Dialog>
        )}
      </div>
    </div>
  );

  return isExpanded ? <div>{chatbotUI}</div> : chatbotUI;

  function ChatbotPanelComp() {
    return (
      <ChatbotSidePanel
        isOpen={isPreviewOpen}
        onClose={closeSidePanel}
        height="100%"
        url={previewPanelUrl}
      >
        {previewPanelUrl && (
          <iframe
            src={previewPanelUrl}
            title="Report Preview"
            style={{
              width: '100%',
              height: '100%',
              background: '#fff',
            }}
            sandbox="allow-scripts allow-same-origin"
          />
        )}
      </ChatbotSidePanel>
    );
  }
}
