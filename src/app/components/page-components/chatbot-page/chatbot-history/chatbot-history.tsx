import ImgComponent from '@/app/components/common/img-component/img-component';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import Search from '@/app/components/common/search/search';
import CustomEditLoader from '@/app/components/shared/custom-edit-loader/custom-edit-loader';
import { imageUrls } from '@/constants/assets/images.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import { IChatbotHistoryMetadata } from '@/interfaces/chatbot.interface';
import {
  selectChatbotSessions,
  selectIsHistorySideBarOpen,
  setIsHistorySideBarOpen,
} from '@/redux/chatbot/chatbot.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getTitleCaseString } from '@/utils';
import { getRelativeTime } from '@/utils/datetime.utils';
import { PlusCircleIcon, SidebarSimpleIcon } from '@phosphor-icons/react';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import styles from './chatbot-history.module.scss';

interface IChatbotHistoryProps {
  newChatHandler: () => void;
  handleHistoryTabClick: (id: string) => void;
  selectedHistoryId: string;
  width?: string;
}

export default function ChatbotHistory({
  newChatHandler,
  handleHistoryTabClick,
  selectedHistoryId,
  width = '100%',
}: IChatbotHistoryProps) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const isHistoryLoading = useIsFetching(
    {
      queryKey: [QueryKeyEnums.HISTORY_METADATA_FETCH],
    },
    queryClient
  );
  const historyList = useAppSelector(selectChatbotSessions);
  const [searchText, setSearchText] = useState('');
  const isHistorySidebarOpen = useAppSelector(selectIsHistorySideBarOpen);

  const toggleSidebar = () =>
    dispatch(setIsHistorySideBarOpen(!isHistorySidebarOpen));

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const chatHistoryList = useMemo(
    () =>
      historyList.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      ),
    [historyList, searchText]
  );
  return (
    <div
      className={`${styles.historyContainer} ${
        !isHistorySidebarOpen ? styles.collapsed : ''
      }`}
    >
      {isHistoryLoading > 0 && isHistorySidebarOpen && (
        <CustomEditLoader
          overlayText="Please wait for a while"
          borderRadius={'2rem'}
        />
      )}

      <div
        className={`${styles.expandedContent} ${
          !isHistorySidebarOpen ? styles.hidden : ''
        }`}
      >
        <div className={styles.historySubContainer}>
          <div className={styles.menuButtonContainer}>
            <ImgComponent
              imageURL={imageUrls.jivaIcon}
              alt="jiva-icon"
              className={styles.jivaIcon}
            />
            <SidebarSimpleIcon
              size={'1.5rem'}
              weight="bold"
              className={styles.sidebarToggleIcon}
              onClick={toggleSidebar}
            />
          </div>
          <div>
            <div className={styles.searchContainer}>
              <Search
                searchText={searchText}
                handleSearchText={handleSearch}
                handleSearchClick={() => setSearchText(searchText)}
                width={width}
                borderRadius="0.6rem"
              />
            </div>
            <div className={styles.tabListContainer}>
              {chatHistoryList &&
                chatHistoryList.length > 0 &&
                chatHistoryList.map((history) => (
                  <ChatbotHistoryTab
                    key={history.session_id}
                    historyMetadata={history}
                    onTabClick={() => handleHistoryTabClick(history.session_id)}
                    isSelected={selectedHistoryId === history.session_id}
                  />
                ))}
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <PrimaryButton
            buttonText="New Chat"
            width="100%"
            fontSize="1.2rem"
            fontWeight="500"
            buttonFunction={newChatHandler}
            isButtonIconRequired={true}
            buttonIcon={<PlusCircleIcon size={'1.5rem'} />}
            disabled={false}
            bgColor="#ffffff"
            textColor="#464646"
          />
        </div>
      </div>

      <div
        className={`${styles.collapsedContent} ${
          isHistorySidebarOpen ? styles.hidden : ''
        }`}
      >
        <div className={styles.collapsedToggleBtn} onClick={toggleSidebar}>
          <div className={styles.collapsedToggleBtnInner}>
            <ImgComponent
              imageURL={imageUrls.botIcon}
              alt="bot-icon"
              className={styles.botIcon}
            />
          </div>
        </div>

        <div className={styles.collapsedNewChatBtn} onClick={newChatHandler}>
          <PlusCircleIcon size="2rem" className={styles.plusIcon} />
        </div>
      </div>
    </div>
  );
}

interface IChatbotHistoryTabProps {
  historyMetadata: IChatbotHistoryMetadata;
  onTabClick: (id: string) => void;
  isSelected: boolean;
}

const ChatbotHistoryTab = ({
  historyMetadata,
  onTabClick,
  isSelected,
}: IChatbotHistoryTabProps) => {
  return (
    <div
      className={`${styles.tabContainer} ${isSelected ? styles.selected : ''}`}
      onClick={() => onTabClick(historyMetadata.session_id)}
    >
      <p className={styles.tabTitle} title={historyMetadata.title}>
        {getTitleCaseString(historyMetadata.title)}
      </p>
      <p
        className={styles.tabTime}
        title={getRelativeTime(historyMetadata.last_access)}
      >
        {getRelativeTime(historyMetadata.last_access)}
      </p>
    </div>
  );
};
