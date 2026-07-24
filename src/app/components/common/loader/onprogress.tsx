import { lottieFiles } from '@/constants/assets/lotties.utils';
import BaseLottieAnimation from './base-lottie-animation';

const OnProgress = () => {
  const style: React.CSSProperties = {
    height: '20rem',
    width: '20rem',
  };
  return (
    <BaseLottieAnimation
      style={style}
      lottieFile={lottieFiles.onProgress}
      lottieOptions={{ loop: true, autoplay: true }}

    />
  );
};

export default OnProgress;
