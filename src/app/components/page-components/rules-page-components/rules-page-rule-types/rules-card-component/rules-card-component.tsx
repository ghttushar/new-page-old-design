import { IRuleTypesTemplatesDetails } from '@/interfaces/rules/rules.interfaces';
import styles from './rules-card-component.module.scss';

interface IRulesCardComponentProps {
  ruleDetails: IRuleTypesTemplatesDetails;
  onCardClick: (value: string, name: string) => void;
  noOfCardsPerRow: 2 | 3;
  isInsidePopup: boolean;
}

export default function RulesCardComponent({
  ruleDetails,
  onCardClick,
  noOfCardsPerRow,
  isInsidePopup,
}: IRulesCardComponentProps) {
  const handleCardClick = (id: string, name: string) => {
    onCardClick(id, name);
  };

  return (
    <div
      className={`${styles.cardContainer} ${
        noOfCardsPerRow === 2
          ? styles.two_grid_card_container
          : styles.three_grid_card_container
      } ${
        isInsidePopup
          ? styles.card_container_inside_popup
          : styles.card_container_outside_popup
      }`}
      onClick={() => handleCardClick(ruleDetails.id, ruleDetails.ruleTypeName)}
    >
      <p className={styles.cardTitle}>{ruleDetails.ruleTypeName}</p>
      <p className={styles.cardDescription}>{ruleDetails.description}</p>
    </div>
  );
}
