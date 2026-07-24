export interface ICustomTableStylesHelper {
  className?: string;
  wrapper?: string;
  tdDiv?: string;
}

export interface ICustomTableHeadRowStyles {
  className?: string;
  th?: ICustomTableStylesHelper;
}

export interface ICustomTableBodyRowStyles {
  className?: string;
  selectedClassName?: string;
  td?: ICustomTableStylesHelper;
}
export interface ICustomTableBodyStyles {
  className?: string;
  tr?: ICustomTableBodyRowStyles;
}

export interface ICustomTableHeaderStyles {
  className?: string;
  tr?: ICustomTableHeadRowStyles;
}

export interface ICustomTableFooterStyles {
  className?: string;
  tr?: ICustomTableBodyRowStyles;
}
export interface ICustomTableStyles {
  className?: string;
  thead?: ICustomTableHeaderStyles;
  tbody?: ICustomTableBodyStyles;
  tfoot?: ICustomTableFooterStyles;
}
