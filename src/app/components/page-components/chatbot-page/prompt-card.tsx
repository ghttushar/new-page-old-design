import styles from './chatbot-page.module.scss';
interface IPromptCardProps {
  prompt: string;
  onClick: (prompt: string) => void;
}
export default function PromptCard({ prompt, onClick }: IPromptCardProps) {
  return (
    <div className={styles.promptCard} onClick={() => onClick(prompt)}>
      {prompt}
    </div>
  );
}
