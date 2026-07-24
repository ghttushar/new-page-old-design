import ProductAdNameComponent from '@/app/components/common/product-ad-name-component/product-ad-name-component';
import CreateKeywordCustomBid from '@/app/components/page-components/edit-access-components/edit-access-default-bid/edit-access-create-keyword-custom-bid';
import EditAccessCreateKeywordStatus from '@/app/components/page-components/edit-access-components/edit-access-status/edit-access-create-keyword-status';
import { ColumnNameEnum } from '@/enums/advertising.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { ISBAdGroup } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDAdGroup } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { IAdGroup } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IAddedDataTableStatus } from '@/interfaces/advertising/create-dialog/create-dialog.interface';
import { IWalmartAdGroup } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IWalmartSVAdGroup } from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import {
  IAddedDataMatchType,
  ICreateProductName,
  ICustomBid,
  IEntityName,
  IId,
  INormalizedKeyword,
  ISuggestedBid,
} from '@/interfaces/column.interface';
import { displayValue, getValidNumber } from '@/utils';
import IconButton from '@mui/material/IconButton';
import { PlusCircleIcon, TrashIcon } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import {
  textCenterStyles,
  textStartStyles,
} from './new-column-names.constants';

export const CREATE_ENTITY_STATUS_COLUMN = (
  updateFunction: (
    id: string | number,
    customBid: number | typeof NaN | undefined,
    status: string | undefined
  ) => void
): ColumnDef<IAddedDataTableStatus> => {
  return {
    accessorKey: 'status',
    id: ColumnNameEnum.STATUS,
    size: 60,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Status
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const status = row.original.status;
      const id = row.original.id;

      return (
        <EditAccessCreateKeywordStatus
          id={id as string | number}
          status={status}
          updateFunction={updateFunction}
        />
      );
    },
  };
};

export const CREATE_KEYWORD_COLUMN: ColumnDef<IEntityName> = {
  accessorKey: 'keyword',
  id: ColumnNameEnum.KEYWORDS,
  size: 200,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Keyword
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const keyword = row.original.entityName;

    return (
      <div className={`commonCell`} style={textStartStyles}>
        <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>{keyword}</p>
      </div>
    );
  },
};

export const NORMALIZED_KEYWORD_LIST_COLUMN: ColumnDef<INormalizedKeyword> = {
  accessorKey: 'normalizedKeyword',
  id: ColumnNameEnum.NORMALIZED_KEYWORD,
  size: 200,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Normalized Keywords
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const normalizedKeyword = row.original.normalizedKeyword;

    return (
      <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>
        {!normalizedKeyword || normalizedKeyword.toUpperCase() === 'NA'
          ? '-'
          : normalizedKeyword}
      </p>
    );
  },
};

export const CUSTOM_BID_COLUMN = (
  selectedAdGroup:
    | IWalmartAdGroup
    | IAdGroup
    | ISBAdGroup
    | ISDAdGroup
    | IWalmartSVAdGroup
    | null,
  updateFunction: (
    id: string | number,
    customBid: number | typeof NaN | undefined,
    status: string | undefined
  ) => void
): ColumnDef<ICustomBid> => {
  return {
    accessorKey: 'customBid',
    id: ColumnNameEnum.CUSTOM_BID,
    size: 90,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Bid
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const bid = row.original.customBid;
      const id = row.original.id;

      return (
        <CreateKeywordCustomBid
          id={id as string | number}
          bid={(getValidNumber(bid) ?? bid) as number}
          selectedAdGroup={selectedAdGroup}
          updateFunction={updateFunction}
        />
      );
    },
  };
};

export const SUGGESTED_BID_COLUMN: ColumnDef<ISuggestedBid> = {
  accessorKey: 'suggestedBid',
  id: ColumnNameEnum.SUGGESTED_BID,
  size: 90,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Suggested Bid
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const suggestedBid = row.original.suggestedBid ?? null;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {displayValue(suggestedBid, false)}
      </div>
    );
  },
};

export const REMOVE_ACTION_COLUMN = (
  handleClearItem: (id: string | number) => void
): ColumnDef<IId> => {
  return {
    accessorKey: 'remove',
    id: ColumnNameEnum.REMOVE,
    size: 60,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Clear
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const id = row.original.id;
      return (
        <IconButton
          onClick={() => handleClearItem(id as string | number)}
          sx={{
            padding: '4px',
            '&:hover': {
              backgroundColor: '#E9E9E9',
              borderRadius: '4px',
            },
          }}
        >
          <TrashIcon size={'2rem'} color="#000000" />
        </IconButton>
      );
    },
  };
};

export const CREATE_PRODUCT_ASIN_COLUMN: ColumnDef<IEntityName> = {
  accessorKey: 'productAsin',
  id: ColumnNameEnum.ASINS,
  size: 200,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Product ASIN
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const asin = row.original.entityName;

    return (
      <div className={`commonCell`} style={textStartStyles}>
        <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>{asin}</p>
      </div>
    );
  },
};

export const ADDED_MATCH_TYPE_COLUMN: ColumnDef<IAddedDataMatchType> = {
  accessorKey: 'matchType',
  id: ColumnNameEnum.MATCH_TYPE,
  size: 100,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Match Type
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.matchType;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {value.label}
      </div>
    );
  },
};

export const CREATE_PRODUCT_NAME_COLUMN = (
  marketplace: MarketplaceEnum
): ColumnDef<ICreateProductName> => {
  return {
    accessorKey: 'productName',
    id: ColumnNameEnum.CREATE_PRODUCT_NAME,
    size: 200,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Product
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const itemId = row.original.item;
      const itemName = row.original.itemName ?? itemId;
      const itemImageUrl = row.original.itemImageUrl;
      const sku = row.original.sku;

      return (
        <ProductAdNameComponent
          itemImageUrl={itemImageUrl}
          itemName={itemName}
          itemId={itemId}
          marketplace={marketplace}
          sku={sku}
        />
      );
    },
  };
};

export const ADD_ITEM_ACTION_COLUMN = (
  handleAddItem: (id: string | number) => void
): ColumnDef<IId> => {
  return {
    accessorKey: 'add',
    id: ColumnNameEnum.REMOVE,
    size: 50,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Add
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const id = row.original.id;
      return (
        <IconButton
          onClick={() => handleAddItem(id as string | number)}
          sx={{
            padding: '4px',
            '&:hover': {
              backgroundColor: '#E9E9E9',
              borderRadius: '4px',
            },
          }}
        >
          <PlusCircleIcon size={'2rem'} color="#000000" />
        </IconButton>
      );
    },
  };
};
