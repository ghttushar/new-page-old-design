import ImgComponent from '@/app/components/common/img-component/img-component';
import { imageUrls } from '@/constants/assets/images.constants';
import { WhatsappLogoIcon } from '@phosphor-icons/react';
import styles from './integration-logos.module.scss';

export function JivaLogo({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <ImgComponent
      imageURL={imageUrls.jivaIcon}
      alt="JIVA"
      className={`${styles.logoImg} ${className ?? ''}`}
      customStyles={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}

export function GptLogo({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <ImgComponent
      imageURL={imageUrls.gptIcon}
      alt="ChatGPT"
      className={`${styles.logoImg} ${className ?? ''}`}
      customStyles={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}

export function ClaudeLogo({
  size = 48,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="Claude"
    >
      <defs>
        <path
          id="claude-spike"
          d="M24 4.6 C25.1 12.6 26.4 16.9 31.5 21.6 C36 25.9 40.4 27.4 43.4 27.6 C35.4 28.7 31.1 30 26.4 35.1 C22.1 39.6 20.6 44 20.4 47 C19.3 39 18 34.7 12.9 30 C8.4 25.7 4 24.2 1 24 C9 22.9 13.3 21.6 18 16.5 C22.3 12 23.8 7.6 24 4.6 Z"
          transform="translate(-24 -24)"
        />
      </defs>
      <circle cx="24" cy="24" r="12" fill="#D97757" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <use
          key={deg}
          href="#claude-spike"
          fill="#D97757"
          transform={`rotate(${deg} 24 24)`}
        />
      ))}
    </svg>
  );
}

export function WhatsappLogo({
  size = 48,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <WhatsappLogoIcon
      size={size}
      weight="fill"
      color="#25D366"
      className={className}
    />
  );
}
