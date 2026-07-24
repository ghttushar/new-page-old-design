import { LottieOptions, useLottie } from 'lottie-react';
import { useEffect, useState } from 'react';

interface IBaseLottieAnimationProps {
  lottieFile: string;
  style?: React.CSSProperties;
  className?: string;
  lottieOptions: Omit<LottieOptions, 'animationData'>;
}

const BaseLottieAnimation: React.FC<IBaseLottieAnimationProps> = (props) => {
  const { style, className, lottieOptions, lottieFile } = props;
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch(lottieFile)
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error('Failed to load Lottie animation:', err));
  }, [lottieFile]);

  const options: LottieOptions = {
    animationData: animationData || {}, // placeholder until loaded
    ...lottieOptions,
  };

  const { View } = useLottie(
    options,
    style ?? { height: '100%', width: '100%' }
  );

  // Show a placeholder until animationData loads
  return (
    <div className={className}>
      {animationData ? View : <div>Loading animation...</div>}
    </div>
  );
};

export default BaseLottieAnimation;
