import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { useRef, useState } from 'react';
import { KeywordActionKeywordTagEnum } from 'src/enums/keyword-action.enums';
import { getTitleCaseString } from 'src/utils';
import styles from '../keyword-action-table.module.scss';
import {
  brandedTagStyles,
  competitorTagStyles,
  genericTagStyles,
  tagApplyBtn,
  tagCancelBtn,
  tagModalStyle,
} from '../keyword-actions-table-styles';

const tags = [
  KeywordActionKeywordTagEnum.BRANDED,
  KeywordActionKeywordTagEnum.COMPETITOR,
  KeywordActionKeywordTagEnum.GENERIC,
];
const tagStyles = [brandedTagStyles, competitorTagStyles, genericTagStyles];

interface ITagModalProps {
  handleSetTagClick: (tag: KeywordActionKeywordTagEnum) => void;
  setShowTagModal: React.Dispatch<React.SetStateAction<boolean>>;
  tag: KeywordActionKeywordTagEnum;
  isTaggingLoading: boolean;
}
export const TagModal = ({
  handleSetTagClick,
  setShowTagModal,
  tag,
  isTaggingLoading,
}: ITagModalProps) => {
  const [selectedTag, setSelectedTag] =
    useState<KeywordActionKeywordTagEnum>(tag);
  const tagContainerRef = useRef<HTMLDivElement>(null);

  const handleTagClick = (tag: KeywordActionKeywordTagEnum) => {
    setSelectedTag(tag);
  };
  const handleCancel = () => {
    setShowTagModal(false);
  };

  const handleApply = () => {
    handleSetTagClick(selectedTag);
  };
  return (
    <div style={tagModalStyle} ref={tagContainerRef}>
      <div style={{ alignSelf: 'start', fontSize: '1.2rem', fontWeight: 700 }}>
        Add Tag
      </div>
      {tags.map((tag, index) => (
        <div
          key={tag}
          style={{
            ...tagStyles[index],
            justifyContent: 'center',
            ...(tag === selectedTag
              ? { border: '0.2rem solid #77469B' }
              : { border: 'none', opacity: 0.9 }),
          }}
          onClick={() => handleTagClick(tag)}
        >
          {getTitleCaseString(tag)}
        </div>
      ))}
      <div style={{ width: '110%', border: '1px solid #ccc' }} />
      <div className={styles.ButtonGroup}>
        <Button
          style={tagCancelBtn}
          onClick={handleCancel}
          disabled={isTaggingLoading}
          sx={{
            '& .Mui-disabled': {
              background: '#F1DEFF',
              cursor: 'not-allowed !important',
              color: '#77469B',
            },
          }}
        >
          Cancel
        </Button>
        <LoadingButton
          style={tagApplyBtn}
          onClick={handleApply}
          sx={{
            '& .MuiDisabled': {
              background: '#F1DEFF',
              cursor: 'not-allowed !important',
              color: '#77469B',
            },
          }}
          loading={isTaggingLoading}
          disabled={isTaggingLoading}
        >
          {isTaggingLoading ? '' : 'Apply'}
        </LoadingButton>
      </div>
    </div>
  );
};
