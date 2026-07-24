import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useEffect, useState } from 'react';
import { IPathItem } from './breadcrumb';
import BreadCrumbItem from './breadcrumb-item';

interface IMICustomBreadcrumbsProps {
  workflowName: string;
}

const AMCCustomBreadcrumbs: React.FC<IMICustomBreadcrumbsProps> = ({
  workflowName,
}) => {
  const [paths, setPaths] = useState<IPathItem[]>([]);

  useEffect(() => {
    const _paths: IPathItem[] = [
      {
        label: 'AMC',
        link: '/amc',
      },
      {
        label: 'Executed Queries',
        link: '/amc/executed-queries',
      },
      {
        label: workflowName,
        link: `/amc/executed-queries/report/${workflowName}`,
      },
    ];
    setPaths(_paths);
  }, [workflowName]);

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="large" sx={{ mx: '-1rem' }} />}
      aria-label="breadcrumb"
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

export default AMCCustomBreadcrumbs;
