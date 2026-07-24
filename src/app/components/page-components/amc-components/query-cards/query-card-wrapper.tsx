import ImgComponent from '@/app/components/common/img-component/img-component';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CUSTOM_REQUEST_IMAGE } from 'src/constants/amc.constants';
import { IAMCQueryData } from 'src/interfaces/amc.interfaces';
import styles from './query-card-wrapper.module.scss';

interface IQueryCardsProps {
  data: IAMCQueryData;
  buttonTitle: string;
  handleButtonClick: () => void;
}

export default function QueryCardWrapper({
  data,
  buttonTitle,
  handleButtonClick,
}: IQueryCardsProps) {
  const handleRunCreate = () => {
    handleButtonClick();
  };

  return (
    <QueryCard
      title={data.title}
      description={data.description}
      imageUrls={data.imageUrls}
      isRequest={false}
      tags={data.tags}
      handleRunCreate={handleRunCreate}
      buttonTitle={buttonTitle}
    />
  );
}

interface IQueryCardProps {
  title: string;
  description: string;
  imageUrls?: string[];
  isRequest: boolean;
  tags?: string[];
  buttonTitle?: string;
  handleRunCreate?: () => void;
  status?: string;
}

export function QueryCard(props: IQueryCardProps) {
  const {
    title,
    description,
    imageUrls,
    isRequest,
    tags,
    handleRunCreate,
    buttonTitle,
    status,
  } = props;
  return (
    <div className={styles.cardContainer}>
      {imageUrls && imageUrls.length ? (
        <div className={styles.imageContainer}>
          <ImgComponent
            className={styles.queryImage}
            imageURL={`${imageUrls[0]}`}
            alt={`${title}`}
          />
        </div>
      ) : (
        <ImgComponent
          className={styles.imageContainer}
          imageURL={`${CUSTOM_REQUEST_IMAGE}`}
          alt={`${title}`}
        />
      )}

      <div className={styles.contentContainer}>
        <div className={styles.tagsContainer}>
          {tags &&
            tags.length > 0 &&
            tags.map((tag) => (
              <div key={tag} className={styles.tag}>
                <p>{tag.toUpperCase()}</p>
              </div>
            ))}
        </div>

        <Typography className={styles.title}>{title}</Typography>
        <Typography className={styles.description}>{description}</Typography>

        {isRequest ? (
          <div className={styles.requestStatus}>{status}</div>
        ) : (
          <Button
            className={styles.actionButton}
            variant="contained"
            onClick={handleRunCreate}
            disableTouchRipple
          >
            {buttonTitle}
          </Button>
        )}
      </div>
    </div>
  );
}
