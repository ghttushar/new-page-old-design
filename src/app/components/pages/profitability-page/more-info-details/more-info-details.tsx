import TextButton from '@/app/components/common/text-button/text-button';
import { IAmazonProfitabilityTableData } from '@/interfaces/profitability/amazon-profitability.interface';
import { IProfitabilityTableData } from '@/interfaces/profitability/profitability.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectSelectedRowIndex,
  setSelectedRowData,
} from '@/redux/slices/profitability/profitability.slice';
import { Row } from '@tanstack/react-table';

export interface MoreInfoProps {
  row: Row<IProfitabilityTableData | IAmazonProfitabilityTableData>;
}

function MoreInfo({ row }: MoreInfoProps) {
  const dispatch = useAppDispatch();
  const selectedParentId = useAppSelector(selectSelectedRowIndex);

  const handleClick = () => {
    dispatch(
      setSelectedRowData({
        index: row.id ?? null,
        rowData: row.original,
      })
    );
  };

  return (
    <div className="relative">
      <TextButton
        label={'More'}
        handleClick={handleClick}
        disableReason=""
        isDisabled={selectedParentId === row.id}
      />
    </div>
  );
}
export default MoreInfo;
