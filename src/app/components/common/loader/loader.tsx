import { lottieFiles } from '@/constants/assets/lotties.utils';
import BaseLottieAnimation from './base-lottie-animation';

const Loader = () => {
  const style: React.CSSProperties = {
    height: '15rem',
    width: '15rem',
  };
  return (
    <BaseLottieAnimation
      style={style}
      lottieFile={lottieFiles.loader}
      lottieOptions={{ loop: true, autoplay: true }}
    />
  );
};

export default Loader;
