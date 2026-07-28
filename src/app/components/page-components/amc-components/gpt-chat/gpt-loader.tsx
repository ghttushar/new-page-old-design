import ImgComponent from '@/app/components/common/img-component/img-component';
import { imageUrls } from '@/constants/assets/images.constants';
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
      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', padding: '1rem' }}>
        <span style={{ width: '0.6rem', height: '0.6rem', borderRadius: '50%', backgroundColor: '#77469b', animation: 'pulse 1s ease-in-out infinite' }} />
        <span style={{ width: '0.6rem', height: '0.6rem', borderRadius: '50%', backgroundColor: '#77469b', animation: 'pulse 1s ease-in-out 0.2s infinite' }} />
        <span style={{ width: '0.6rem', height: '0.6rem', borderRadius: '50%', backgroundColor: '#77469b', animation: 'pulse 1s ease-in-out 0.4s infinite' }} />
      </div>
    </div>
  );
};
