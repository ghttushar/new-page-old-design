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

export function JivaJLogo({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 43.91 65.22"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Jiva"
    >
      <path
        transform="matrix(2.778,0,0,-2.778,0.556,64.687)"
        d="M15.439 15.434V7.717C15.439 3.457 11.981 0 7.719 0 3.458 0 0 3.457 0 7.717h7.719v7.717h7.72z"
        fill="#77469b"
      />
      <path
        transform="matrix(2.778,0,0,-2.778,23.158,19.036)"
        d="M3.427 0C5.32 0 6.855 1.534 6.855 3.426 6.855 5.319 5.32 6.853 3.427 6.853 1.535 6.853 0 5.319 0 3.426 0 1.534 1.535 0 3.427 0Z"
        fill="#f26e77"
      />
      <path
        transform="matrix(2.778,0,0,-2.778,22,64.687)"
        d="M0 15.442H-.2V0H0 .2V15.442H0Z"
        fill="#ffffff"
      />
      <path
        transform="matrix(2.778,0,0,-2.778,0.556,65.756)"
        d="M0 8.14H-.2V7.94H0V8.14ZM15.41 8.14H15.61V8.34H15.41V8.14ZM0 8.14V7.94H15.41V8.14V8.34H0V8.14ZM15.41 8.14H15.21V8.04H15.41V15.61V8.14H15.41ZM15.41 8.04H15.21C15.21 3.93 11.87.59 7.76.59V.39V.19C12.09.19 15.61 3.71 15.61 8.04H15.41ZM7.76.39V.59C3.59.59.2 3.97.2 8.15H0V-.2C-.2 3.75 3.37.19 7.76.19V.39ZM0 8.15H-.2V8.14H0V.2V8.15H0Z"
        fill="#ffffff"
      />
    </svg>
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

export function ChatGptFlowerLogo({
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
      aria-label="ChatGPT"
    >
      <g
        transform="translate(24,24)"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="-3" y="-17" width="6" height="24" rx="3" transform="rotate(0)" />
        <rect x="-3" y="-17" width="6" height="24" rx="3" transform="rotate(60)" />
        <rect x="-3" y="-17" width="6" height="24" rx="3" transform="rotate(120)" />
        <rect x="-3" y="-17" width="6" height="24" rx="3" transform="rotate(180)" />
        <rect x="-3" y="-17" width="6" height="24" rx="3" transform="rotate(240)" />
        <rect x="-3" y="-17" width="6" height="24" rx="3" transform="rotate(300)" />
      </g>
    </svg>
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
