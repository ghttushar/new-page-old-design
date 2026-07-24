import { TooltipPlacement } from '@/enums/tooltip-texts.enums';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { UserRolesEnum } from 'src/enums/invites.enums';

export const userRoleOptions: IDropdownItem<UserRolesEnum>[] = [
  {
    label: 'Admin',
    value: UserRolesEnum.ADMIN,
    isDisabled: true,
    tooltipText: 'Not Applicable',
    tooltipPosition: TooltipPlacement.Right,
  },
  {
    label: 'Manager',
    value: UserRolesEnum.MANAGER,
  },
  {
    label: 'User',
    value: UserRolesEnum.USER,
  },
];

export const COUNTRY_MAPPING = new Map([
  ['ATVPDKIKX0DER', { country: 'United States', countryCode: 'US' }],
  ['A2EUQ1WTGCTBG2', { country: 'Canada', countryCode: 'CA' }],
  ['A1AM78C64UM0Y8', { country: 'Mexico', countryCode: 'MX' }],
  ['A2Q3Y263D00KWC', { country: 'Brazil', countryCode: 'BR' }],
  ['A1RKKUPIHCS9HS', { country: 'Spain', countryCode: 'ES' }],
  ['A1F83G8C2ARO7P', { country: 'United Kingdom', countryCode: 'UK' }],
  ['A13V1IB3VIYZZH', { country: 'France', countryCode: 'FR' }],
  ['A1PA6795UKMFR9', { country: 'Germany', countryCode: 'DE' }],
  ['AMEN7PMS3EDWL', { country: 'Belgium', countryCode: 'BE' }],
  ['A1805IZSGTT6HS', { country: 'Netherlands', countryCode: 'NL' }],
  ['APJ6JRA9NG5V4', { country: 'Italy', countryCode: 'IT' }],
  ['A2NODRKZP88ZB9', { country: 'Sweden', countryCode: 'SE' }],
  ['AE08WJ6YKNBMC', { country: 'Souht Africa', countryCode: 'ZA' }],
  ['A1C3SOZRARQ6R3', { country: 'Poland', countryCode: 'PL' }],
  ['ARBP9OOSHTCHU', { country: 'Egypt', countryCode: 'EG' }],
  ['A33AVAJ2PDY3EV', { country: 'Turkey', countryCode: 'TR' }],
  ['A17E79C6D8DWNP', { country: 'Saudi Arabia', countryCode: 'SA' }],
  ['A2VIGQ35RCS4UG', { country: 'United Arab Emirates', countryCode: 'AE' }],
  ['A21TJRUUN4KGV', { country: 'India', countryCode: 'IN' }],
  ['A19VAU5U5O7RUS', { country: 'Singapore', countryCode: 'SG' }],
  ['A39IBJ37TRP1C6', { country: 'Australia', countryCode: 'AU' }],
  ['A1VC38T7YXB528', { country: 'Japan', countryCode: 'JP' }],
]);
export const ACCOUNT_TYPE_MAPPING = new Map([
  ['3P', 'Seller'],
  ['1P', 'Supplier'],
]);

export const CONNECT_BUTTON_DESC_CATALOG =
  'Click on “Connect” to fetch Product Catalog data';

export const CONNECT_BUTTON_DESC_ADVERTISING =
  'Click on “Connect” to fetch Advertising data';
export const SYNC_TEXT =
  'It can take up to 24 hours to full sync your ads data in Anarix. We’ll notify you when your data is ready. ';

export const DISCONNECT_ADVERTISING = 'Disconnect Advertising';
export const DISCONNECT_PRODUCT_CATALOG = 'Disconnect Product Catalog';
export const DISCONNECT_CONFIRMATION_TEXT = `If you disconnect your “Advertising” account, you won’t be able to see the data anymore. Are you sure want to continue?`;

export const DISCONNECT_CONFIRMATION_TITLE = `Are you sure?`;
