import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import { IKeywordActionTableFilter } from 'src/interfaces/keyword-actions.interface';
import {
  applyButtonStyle,
  modalContainerStyle,
  modalInputStyle,
} from './keyword-action-filter-modal-styles';

interface KeywordActionFilterModalProps {
  filter: IKeywordActionTableFilter;
  handleClose: () => void;
  handleAppliedFilter: (filter: IKeywordActionTableFilter) => void;
}

export const KeywordActionFilterModal: React.FC<
  KeywordActionFilterModalProps
> = ({ handleClose, filter, handleAppliedFilter }) => {
  const [internalFilter, setInternalFilter] = React.useState(filter);

  React.useEffect(() => {
    setInternalFilter(filter);
  }, [filter]);

  const handleApply = () => {
    handleAppliedFilter(internalFilter);
    handleClose();
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Box>
        <h4>{filter.label}</h4>
        <div style={modalContainerStyle}>
          <input
            style={modalInputStyle}
            value={internalFilter.filterValue || ''}
            type="number"
            onChange={(e) =>
              setInternalFilter({
                ...internalFilter,
                filterValue: e.target.value,
              })
            }
          />
          <Button
            variant="contained"
            onClick={handleApply}
            sx={applyButtonStyle}
          >
            Apply
          </Button>
        </div>
      </Box>
    </div>
  );
};
