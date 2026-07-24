import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface CircularCountdownProps {
  duration: number; // in seconds
  onTimeout: () => void;
}

const CircularCountdown = ({ duration, onTimeout }: CircularCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeout(); // Trigger session timeout
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  const percentage = (timeLeft / duration) * 100;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '0 1.8rem 0 0',
      }}
    >
      <CircularProgressbar
        value={percentage}
        text={`${formatTime(timeLeft)}s`}
        styles={buildStyles({
          textColor: '#464646',
          pathColor: timeLeft > 30 ? '#26C26F' : '#FF7878',
          trailColor: '#E5E5E5',
          textSize: '1.6rem',
          strokeLinecap: 'round',
        })}
      />
    </div>
  );
};

export default CircularCountdown;
