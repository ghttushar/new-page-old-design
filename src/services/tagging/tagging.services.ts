import { TAGGING_API_BASE_URL } from '@/constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IAPIResponse } from '@/interfaces/service.interface';
import {
  ICreateTagPayload,
  ITagDetails,
  IUpdateTagPayload,
} from '@/interfaces/tagging/tagging.interfaces';
import { axiosInstance } from '@/redux/store';

export const TaggingServices = {
  getTagsList: (metaId: string, marketplace: MarketplaceEnum, signal?: AbortSignal) => {
    return axiosInstance.get<IAPIResponse<ITagDetails[]>>(
      `${TAGGING_API_BASE_URL}?metaId=${metaId}&marketplace=${marketplace}`,
      {
        signal,
      }
    );
  },
  getTag: (metaId: string, tagId: string, marketplace: MarketplaceEnum, signal?: AbortSignal) => {
    return axiosInstance.get<IAPIResponse<ITagDetails[]>>(
      `${TAGGING_API_BASE_URL}/${tagId}?metaId=${metaId}&marketplace=${marketplace}`,
      {
        signal,
      }
    );
  },
  createTag: (metaId: string, payload: ICreateTagPayload) => {
    return axiosInstance.post<IAPIResponse<ITagDetails | null>>(
      `${TAGGING_API_BASE_URL}?metaId=${metaId}&marketplace=${payload.marketplace}`,
      payload
    );
  },
  updateTag: (metaId: string, tagId: string, payload: IUpdateTagPayload) => {
    return axiosInstance.put<IAPIResponse<ITagDetails | null>>(
      `${TAGGING_API_BASE_URL}/${tagId}?metaId=${metaId}&marketplace=${payload.marketplace}`,
      payload
    );
  },
  deleteTag: (metaId: string, tagId: string, marketplace: MarketplaceEnum) => {
    return axiosInstance.delete<IAPIResponse<null>>(
      `${TAGGING_API_BASE_URL}/${tagId}?metaId=${metaId}&marketplace=${marketplace}`
    );
  },
};
