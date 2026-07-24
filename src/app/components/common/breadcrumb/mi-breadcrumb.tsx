import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useEffect, useState } from 'react';
import { MARKET_INTELLIGENCE_URL } from 'src/constants/urls.constants';
import { IPathItem } from './breadcrumb';
import BreadCrumbItem from './breadcrumb-item';

interface IMICustomBreadcrumbsProps {
  brand: string;
  marketplace: string;
}

const MICustomBreadcrumbs: React.FC<IMICustomBreadcrumbsProps> = ({
  brand,
  marketplace,
}) => {
  const [paths, setPaths] = useState<IPathItem[]>([]);

  useEffect(() => {
    const _paths: IPathItem[] = [
      {
        label: 'Business Intelligence',
        link: `${MARKET_INTELLIGENCE_URL}/brand-sov/${marketplace}`,
      },
      {
        label: brand,
        link: `${MARKET_INTELLIGENCE_URL}/brand/${brand}`,
      },
    ];
    setPaths(_paths);
  }, [brand, marketplace]);

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="large" sx={{ mx: '-1rem' }} />}
      aria-label="breadcrumb"
      sx={{ marginBottom: '1rem' }}
      data-test="mi-breadcrumbs"
    >
      {paths.map((path, index) => (
        <BreadCrumbItem
          key={`${path.label}-${index}`}
          label={path.label}
          link={path.link}
          isLastSegment={index === paths.length - 1}
        />
      ))}
    </Breadcrumbs>
  );
};

export default MICustomBreadcrumbs;
