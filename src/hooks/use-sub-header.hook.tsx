import { ISubHeaderProps } from '@/app/components/common/sub-header/sub-header';
import { PageTitleEnum } from '@/enums/index.enums';
import { useAppDispatch } from '@/redux/hooks';
import { setSubheaderOptions } from '@/redux/slices/advertising/sub-header.slice';
import { setIsSidebarMenuOpen } from '@/redux/slices/auth/auth.slice';
import { useEffect } from 'react';

const useSubHeader = (
  title: string,
  pageTitleTooltip: string,
  isNewUser: boolean | undefined = undefined
) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (title === '' && !isNewUser) dispatch(setIsSidebarMenuOpen(false));
    const subHeaderOptions: ISubHeaderProps = {
      title: title,
      titleTooltip: pageTitleTooltip,
      isDropdownRequired: false,
      dropdownOptions: [],
      goBackButton: title === PageTitleEnum.ONBOARDING,
    };
    dispatch(setSubheaderOptions(subHeaderOptions));
  }, [dispatch, title, pageTitleTooltip, isNewUser]);
};

export default useSubHeader;
