import styles from './onboarding-page.module.scss';
const OnboardingFooter = () => {
  const cardData = [
    {
      title: 'Bidder',
      description: `Get personalized suggestions based on your 
      ACoS and ROl goals. Minimize spend and maximize profits 
      with machine learning technology.`,
      img: '',
    },
    {
      title: 'Dayparting',
      description: `Get personalized suggestions based on your 
      ACoS and ROl goals. Minimize spend and maximize profits 
      with machine learning technology.`,
      img: '',
    },
    {
      title: 'Keyword Actions',
      description: `Get personalized suggestions based on your 
        ACoS and ROl goals. Minimize spend and maximize profits 
        with machine learning technology.`,
      img: '',
    },
    {
      title: 'Impact Analysis',
      description: `Get personalized suggestions based on your 
        ACoS and ROl goals. Minimize spend and maximize profits 
        with machine learning technology.`,
      img: '',
    },
  ];
  return (
    <div className={styles.onboardingFooter}>
      <div className={styles.onboardingFooterText}>
        Amazon Advertising made simple
      </div>
      <div className={styles.onboardingFooterCardContainer}>
        {cardData.map((card, index) => {
          return (
            <div key={index} className={styles.onboardingFooterCard}>
              <div className={styles.onboardingFooterCardImg}>picture</div>
              <div className={styles.onboardingFooterCardTextContainer}>
                <div className={styles.onboardingFooterCardTitle}>
                  {card.title}
                </div>
                <div className={styles.onboardingFooterCardDescription}>
                  {card.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingFooter;
