import { IExportKeyword, ISerpKeyword } from 'src/interfaces/serp.interface';

export interface ISegregatedKeywords {
  activeKeywords: ISerpKeyword[];
  inActiveKeywords: ISerpKeyword[];
}

const keywordTrackerUtils = {
  filterKeywords: (keywords: ISerpKeyword[], isActive?: boolean) => {
    const filteredKeywords = keywords.map<ISerpKeyword>((keyword) => {
      const channels = keyword.channels.filter(
        (channel) => channel.isActive === isActive
      );
      return {
        ...keyword,
        channels,
      };
    });
    return filteredKeywords.filter((keyword) => keyword.channels.length);
  },
  getKeywordsSegregatedByType: (
    keywords: ISerpKeyword[]
  ): ISegregatedKeywords => {
    return {
      activeKeywords: keywordTrackerUtils.filterKeywords(keywords, true),
      inActiveKeywords: keywordTrackerUtils.filterKeywords(keywords, false),
    };
  },
  getKeywordsToExport: (keywordList: ISerpKeyword[]): Array<IExportKeyword> => {
    const keywordsToExport: Array<IExportKeyword> = [];
    keywordList.forEach((keywordItem) => {
      const { keyword, channels } = keywordItem;
      channels.forEach((channel) => {
        keywordsToExport.push({
          keyword,
          isActive: channel.isActive,
          channel: channel.channel,
          createdAt: keywordItem.createdAt,
          updatedAt: keywordItem.updatedAt,
          countryCode: channel.countryCodes.join(','),
        });
      });
    });
    return keywordsToExport;
  },
};

export default keywordTrackerUtils;
