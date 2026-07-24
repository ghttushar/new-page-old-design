import { useAppDispatch } from '@/redux/hooks';
import { setSearchText } from '@/redux/slices/advertising/advertising-filter.slice';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { getUrlWithQuery } from 'src/utils';

interface IBreadCrumbItemProps {
  isLastSegment: boolean;
  label: string;
  link: string;
}

const BreadCrumbItem: React.FC<IBreadCrumbItemProps> = ({
  isLastSegment,
  label,
  link,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  if (isLastSegment) {
    return (
      <Typography
        color="text.primary"
        fontSize={12}
        fontWeight={600}
        style={{
          whiteSpace: 'pre-wrap',
        }}
      >
        {label}
      </Typography>
    );
  }

  function handleClick(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: string
  ) {
    event.preventDefault();
    dispatch(setSearchText(''));
    navigate(getUrlWithQuery(link));
  }

  return (
    <Link
      underline="hover"
      color="#000000"
      fontSize={12}
      href={getUrlWithQuery(link)}
      onClick={(e) => handleClick(e, link)}
    >
      {label}
    </Link>
  );
};

export default BreadCrumbItem;
