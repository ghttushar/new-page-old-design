import { imageUrls } from '@/constants/assets/images.constants';
import ImgComponent from '../img-component/img-component';
import styles from './logo.module.scss';

export default function Logo() {
  return (
    <div className={styles.logoContainer}>
      <ImgComponent imageURL={imageUrls.anarixLogo} alt="logo" />
      <h6>Automate. Accelerate. Analyse.</h6>
    </div>
  );
}
