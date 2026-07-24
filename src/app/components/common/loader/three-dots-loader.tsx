import { lottieFiles } from '@/constants/assets/lotties.utils';
import BaseLottieAnimation from './base-lottie-animation';

const ThreeDotLoader = () => {
  const style: React.CSSProperties = {
    height: '8rem',
    width: '8rem',
  };

  return (
    <BaseLottieAnimation
      style={style}
      lottieFile={lottieFiles.threeDotLoader}
      lottieOptions={{ loop: true, autoplay: true }}
    />
  );
};

export default ThreeDotLoader;
