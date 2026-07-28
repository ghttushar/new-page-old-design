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
      <div style={{ display: 'flex', gap: '0.4rem', padding: '1rem' }}>
        <span style={{ width: '0.6rem', height: '0.6rem', borderRadius: '50%', backgroundColor: '#77469b', animation: 'pulse 1s ease-in-out infinite' }} />
        <span style={{ width: '0.6rem', height: '0.6rem', borderRadius: '50%', backgroundColor: '#77469b', animation: 'pulse 1s ease-in-out 0.2s infinite' }} />
        <span style={{ width: '0.6rem', height: '0.6rem', borderRadius: '50%', backgroundColor: '#77469b', animation: 'pulse 1s ease-in-out 0.4s infinite' }} />
      </div>
    </div>
  );
};
