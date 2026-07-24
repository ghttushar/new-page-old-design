import { lottieFiles } from '@/constants/assets/lotties.utils';
import { useNavigate } from 'react-router-dom';
import EmptyState, {
  IEmptyStateProps,
} from '../../common/empty-state/empty-state';
import styles from './page-not-found.module.scss';

const emptyState: IEmptyStateProps = {
  emptyTitle: 'Page Not Found',
  emptyDescription: `This page does not exist. Click below to redirect to the Home page.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: true,
  buttonText: 'Home',
};

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.pageNotFoundPage}>
      <EmptyState {...emptyState} />
    </div>
  );
}
