import ImgComponent from '@/app/components/common/img-component/img-component';
import { imageUrls } from '@/constants/assets/images.constants';
import ThreeDotLoader from 'src/app/components/common/loader/three-dots-loader';
import styles from './gpt-chat-modal.module.scss';

export const GPTLoader = () => {
  return (
    <div className={styles.gptLoader}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '-4rem',
          justifySelf: 'flex-start',
        }}
      >
        <ImgComponent
          imageURL={imageUrls.headerLogo}
          alt="header-logo"
          customStyles={{ marginRight: '0.3rem' }}
        />
        <h5>GPT</h5>
      </div>
      <ThreeDotLoader />
    </div>
  );
};
