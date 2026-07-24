import { fancyScrollbar } from '@/assets/styles/scrollbar.styles';
import { imageUrls } from '@/constants/assets/images.constants';
import {
  CHATBOT_CLEAR_EVENT,
  SAMPLE_PROMPT_MAPPING,
} from '@/constants/chatbot.constants';
import { JIVAViewTypeEnum } from '@/enums/chatbot.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  selectViewType,
  setIsHistorySideBarOpen,
} from '@/redux/chatbot/chatbot.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectAdvertisingAccount,
  selectIsAuthenticated,
  selectIsChatbotExpanded,
  selectIsChatbotOpen,
  selectIsNavigating,
  setIsChatbotExpanded,
  setIsChatbotOpen,
} from '@/redux/slices/auth/auth.slice';
import chatbotUtils from '@/utils/chatbot.utils';
import Drawer from '@mui/material/Drawer';
import {
  ArrowsOutSimpleIcon,
  BroomIcon,
  MinusIcon,
  XIcon,
} from '@phosphor-icons/react';
import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ImgComponent from '../../common/img-component/img-component';
import { drawerPaperProps } from '../../layout/side-bar/side-bar-styles';
import ChatbotComponent from './chatbot-component';

export default function ChatbotDrawer() {
  const dispatch = useAppDispatch();
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const location = useLocation();

  const isChatbotOpen = useAppSelector(selectIsChatbotOpen);
  const toggleChatbot = () => {
    dispatch(setIsChatbotOpen(!isChatbotOpen));
  };

  const handleChatbotClose = () => {
    chatbotUtils.closeChatbot(dispatch);
    chatbotUtils.newSession();
  };

  const isChatbotExpanded = useAppSelector(selectIsChatbotExpanded);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isNavigating = useAppSelector(selectIsNavigating);

  const marketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace,
    [selectedAdvertisingAccount]
  );

  const toggleChatbotExpanded = () => {
    dispatch(setIsHistorySideBarOpen(true));
    dispatch(setIsChatbotExpanded(!isChatbotExpanded));
  };

  /* 
    Rules Page Logic:
    - isRulesHomePage: /rules/agents and /rules/applied-rules - Has both Chat and Insights views with full controls
    - isFixedMode: Other rules pages - Chat only, chatbot is pinned
  */
  const isRulesHomePage = chatbotUtils.isRulesHomePage(location.pathname);

  const isOnRulesPage = chatbotUtils.isOnRulesPage(location.pathname);

  const isFixedMode = chatbotUtils.isChatbotFixedMode(location.pathname);

  // Get current view type from Redux to detect if viewing Insights on ANY rules page
  const viewType = useAppSelector(selectViewType);
  const isViewingInsights =
    isOnRulesPage && viewType === JIVAViewTypeEnum.INSIGHTS;

  useEffect(() => {
    if (isFixedMode && !isChatbotOpen && isAuthenticated && !isNavigating) {
      dispatch(setIsChatbotOpen(true));
    }
  }, [isFixedMode, dispatch, isAuthenticated, isNavigating]);

  useEffect(() => {
    if (isRulesHomePage) {
      chatbotUtils.closeChatbot(dispatch);
    }
  }, [isRulesHomePage, dispatch]);

  return (
    <div
      style={{
        position: 'absolute',
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: isChatbotOpen ? '35rem' : '0',
          visibility: isChatbotOpen ? 'visible' : 'hidden',
          '& .MuiDrawer-paper': {
            width: isChatbotOpen ? (isChatbotExpanded ? '100vw' : '35rem') : 0,
            height: '98%',
            boxSizing: 'border-box',
            marginRight: '1.1rem',
            marginTop: '0.8rem',
            borderRadius: '1rem',
            transition: 'width 0.2s ease-in-out',
            boxShadow: isChatbotExpanded
              ? 'none'
              : '0 0.2rem 0.4rem 0 rgba(0,0,0,0.2)',
            backgroundColor: isChatbotExpanded ? 'transparent' : undefined,
            pointerEvents: isChatbotExpanded ? 'none' : 'auto',
            ...fancyScrollbar,
          },
          transition: (theme) =>
            theme.transitions.create('all', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
        anchor="right"
        open={isChatbotOpen}
        elevation={0}
        PaperProps={{
          sx: {
            ...drawerPaperProps,
          },
        }}
      >
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: isChatbotExpanded ? 'none' : 'block',
            }}
          >
            <div
              id="chatbot-header"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                width: '100%',
                justifyContent: 'space-between',
                zIndex: '1000',
                backgroundColor: 'white',
                boxShadow: 'rgba(0, 0, 0, 0.2) -0.1rem 0.2rem 0.4rem 0',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.2rem',
                }}
              >
                {isViewingInsights ? (
                  <div
                    style={{
                      border: '2px solid #894DB5',
                      borderRadius: '0.8rem',
                      padding: '0.3rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                    }}
                  >
                    <ImgComponent
                      imageURL={imageUrls.botIcon}
                      alt="jiva-icon"
                      customStyles={{
                        height: '2.4rem',
                        width: 'auto',
                      }}
                    />
                  </div>
                ) : (
                  <ImgComponent
                    imageURL={imageUrls.jivaIcon}
                    alt="jiva-icon"
                    customStyles={{
                      height: '3rem',
                      width: 'auto',
                    }}
                  />
                )}
                {isViewingInsights === true && (
                  <span
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      fontFamily: 'Inter',
                      color: '#1f2937',
                    }}
                  >
                    JiVA Intelligence
                  </span>
                )}
              </div>
              <span
                style={{
                  display: 'flex',
                  gap: '2rem',
                }}
              >
                {!isViewingInsights && !isFixedMode && (
                  <MinusIcon
                    size={'2rem'}
                    onClick={toggleChatbot}
                    style={{
                      cursor: 'pointer',
                    }}
                  />
                )}

                {!isViewingInsights && (
                  <BroomIcon
                    onClick={chatbotUtils.newSession}
                    size={'2rem'}
                    style={{
                      cursor: 'pointer',
                    }}
                  />
                )}

                {!isViewingInsights && !isFixedMode && (
                  <React.Fragment>
                    <ArrowsOutSimpleIcon
                      size={'2rem'}
                      onClick={toggleChatbotExpanded}
                      style={{
                        cursor: 'pointer',
                      }}
                    />
                    <XIcon
                      size={'2rem'}
                      onClick={handleChatbotClose}
                      style={{
                        cursor: 'pointer',
                      }}
                    />
                  </React.Fragment>
                )}
              </span>
            </div>
          </div>
          <div
            style={{
              opacity: isChatbotOpen ? '1' : '0',
              transition: 'opacity 0.2s ease-in-out',
              flex: 1,
              minHeight: 0,
            }}
          >
            <ChatbotComponent
              samplePrompts={
                SAMPLE_PROMPT_MAPPING[marketplace ?? MarketplaceEnum.AMAZON]
              }
              open={isChatbotOpen}
              isExpanded={isChatbotExpanded}
              handlePopupClose={() => {
                toggleChatbotExpanded();
                toggleChatbot();
              }}
              handlePopupMinimize={toggleChatbotExpanded}
              clearSearchEvent={CHATBOT_CLEAR_EVENT}
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
}
