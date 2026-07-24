import { Box, Modal, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { IReview } from 'src/interfaces/review-analysis.interface';
import styles from './review-score-modal.module.scss';

interface ReviewScoreModalProps {
  review: IReview | null;
  closeScoreModal: () => void;
  open: boolean;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '65rem',
  bgcolor: 'background.paper',
  border: '1px solid #dadeeb',
  borderRadius: 2,
  p: 3,
  outline: 'none',
  maxHeight: '80vh',
  overflowY: 'auto',
};

const ReviewScoreModal = (props: ReviewScoreModalProps) => {
  const { review, closeScoreModal, open } = props;

  const getTagColor = (type: string) => {
    if (type === 'positive') {
      return '#d3abf1';
    } else if (type === 'negative') {
      return '#ffb7bc';
    } else {
      return '#e2e2e2';
    }
  };

  return (
    <Modal
      open={open}
      onClose={closeScoreModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className={styles.modalTitleContainer}>
          {' '}
          <Typography
            id="review-keyword"
            sx={{
              fontSize: '2.4rem',
              fontWeight: '600',
              marginBottom: '1rem',
            }}
          >
            {review?.keyword}
          </Typography>
          {/* <div
            className={styles.scoreTag}
            style={{ backgroundColor: getTagColor(review?.type as string) }}
          >
            <Typography
              id="review-keyword-score"
              sx={{
                fontSize: '1.5rem',
                fontWeight: '500',
              }}
            >
              {50}%
            </Typography>
          </div> */}
        </div>
        <ReactMarkdown className={styles.chatText}>
          {review?.content}
        </ReactMarkdown>
        {/* <div className={styles.pointsContainer}>
          <ul>
            {review?.points.map((point) => {
              return (
                <li key={point.id} className={styles.point}>
                  <Typography
                    id="modal-modal-description"
                    sx={{ mt: 0.5, fontSize: '1.3rem' }}
                  >
                    {point.point}
                  </Typography>
                </li>
              );
            })}
          </ul>
        </div> */}
      </Box>
    </Modal>
  );
};

export default ReviewScoreModal;
