import confetti from 'canvas-confetti';
import React, { useEffect, useRef, useState } from 'react';

interface CanvasConfettiProps {
  width?: number;
  height?: number;
  autoFire?: boolean;
  delay?: number;
}

const CanvasConfetti: React.FC<CanvasConfettiProps> = ({
  autoFire = true,
  delay = 200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiInstanceRef = useRef<confetti.CreateTypes | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (canvasRef.current && !confettiInstanceRef.current) {
      confettiInstanceRef.current = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true,
      });
      setIsReady(true);
    }

    return () => {
      if (confettiInstanceRef.current) {
        confettiInstanceRef.current.reset();
      }
    };
  }, []);

  const fireConfetti = (customOptions?: confetti.Options) => {
    if (confettiInstanceRef.current) {
      confettiInstanceRef.current({
        spread: 10,
        origin: { y: 0.7 },
        particleCount: 150,
        colors: [
          '#ff0000',
          '#00ff00',
          '#0000ff',
          '#ffff00',
          '#ff00ff',
          '#00ffff',
        ],
        ...customOptions,
      });
    }
  };

  useEffect(() => {
    if (isReady && autoFire) {
      const timer = setTimeout(() => {
        fireConfetti({
          spread: 70,
          origin: { y: -1 },
          angle: 270,
          gravity: 0.8,
        });
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isReady, autoFire, delay]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={'100%'}
        height={'100%'}
        style={{
          width: '100%',
          overflow: 'hidden',
        }}
      />
    </div>
  );
};

export default CanvasConfetti;
