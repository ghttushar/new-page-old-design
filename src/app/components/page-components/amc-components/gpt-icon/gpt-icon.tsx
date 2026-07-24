import ImgComponent from '@/app/components/common/img-component/img-component';
import { imageUrls } from '@/constants/assets/images.constants';
import styles from './gpt-icon.module.scss';

interface GPTFloatingIconProps {
  onIconClick: () => void;
}
export const GPTFloatingIcon: React.FC<GPTFloatingIconProps> = ({
  onIconClick,
}) => {
  return (
    <div className={styles.gptContainer}>
      <ImgComponent
        imageURL={imageUrls.gptIcon}
        alt="gpt-icon"
        customStyles={{
          width: '10rem',
          objectFit: 'contain',
        }}
        onClick={() => onIconClick()}
      />
    </div>
  );
};

export default GPTFloatingIcon;
