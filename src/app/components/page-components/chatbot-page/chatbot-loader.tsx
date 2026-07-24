import ThreeDotLoader from 'src/app/components/common/loader/three-dots-loader';

export const BotLoader = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'center',
        position: 'absolute',
        left: '4.4rem',
        bottom: '-3.2rem',
      }}
    >
      <ThreeDotLoader />
    </div>
  );
};
