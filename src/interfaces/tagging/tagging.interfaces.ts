import { MarketplaceEnum } from '@/enums/serp.enums';
import { Nullable } from '../index.interface';

export interface ITagDetails {
  tagId: string;
  metaId: string;
  tagName: string;
  tagColor: Nullable<string>;
  createdAt: string;
  updatedAt: string;
  campaignCount: Nullable<number>;
}

export interface ICreateTagPayload {
  tagName: string;
  tagColor: Nullable<string>;
  marketplace: MarketplaceEnum;
}

export interface IUpdateTagPayload {
  tagName: string;
  marketplace: MarketplaceEnum;
}
