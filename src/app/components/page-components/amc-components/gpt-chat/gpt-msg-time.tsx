import { getCurrentTimeWithAMPM } from 'src/utils';

interface GPTMessageTimeProps {
  role: string;
}
export const GPTMessageTime: React.FC<GPTMessageTimeProps> = ({ role }) => {
  const justifyContentStyle = role === 'user' ? 'flex-end' : 'flex-start';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: justifyContentStyle,
        margin: '0 0.8rem',
      }}
    >
      <p>{getCurrentTimeWithAMPM()}</p>
    </div>
  );
};
