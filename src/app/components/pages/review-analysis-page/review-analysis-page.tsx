import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  IReview,
  IReviewAnalysisData,
} from 'src/interfaces/review-analysis.interface';
import ReviewAnalysisService from 'src/services/review-analysis.service';
import { extractAsinFromUrl } from 'src/utils/review-analysis.utils';
import ReviewPerformanceBox from '../../page-components/review-analysis-components/review-performance-box/review-performance-box';
import ReviewScoreModal from '../../page-components/review-analysis-components/review-score-modal/review-score-modal';
import ReviewSummary from '../../page-components/review-analysis-components/review-summary/review-summary';
import styles from './review-analysis-page.module.scss';
import {
  URLInputStyles,
  analyseBtnStyles,
  urlErrInputStyles,
} from './review-analysis.styles';

const texts = [
  `"Please be patient as we process the data for the link. It may take a few minutes."`,
  `"Generating a review analysis report for the provided link. Please wait for 2 to 3 minutes."`,
];
const ReviewAnalysisPage = () => {
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState<IReview | null>(null);
  const [url, setUrl] = useState('');
  const [isAsinValid, setIsAsinValid] = useState(true);
  const [fetchingData, setFetchingData] = useState(false);
  const [height, setHeight] = useState('90vh');
  const [data, setData] = useState<IReviewAnalysisData | null>(null);
  const [waitText, setWaitText] = useState(texts[0]);

  const onClick = (review: IReview) => {
    setModalData(review);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      setWaitText(texts[currentIndex]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleAnalyse = () => {
    if (url.length === 0) {
      setIsAsinValid(false);
      return;
    }

    setHeight('unset');
    setIsAsinValid(true);
    setFetchingData(true);
    setData(null);

    const extractedAsin = extractAsinFromUrl(url);

    if (extractedAsin === null) {
      setIsAsinValid(false);
      setFetchingData(false);
      setData(null);
      return;
    }

    ReviewAnalysisService.getReviewAnalysisData({
      asin: extractedAsin,
    })
      .then((response) => {
        setData(response.data.data);
        setIsAsinValid(true);
        setFetchingData(false);
      })
      .finally(() => {
        setFetchingData(false);
      });
  };

  return (
    <div className={styles.reviewAnalysisWrapper} style={{ height: height }}>
      <div className={styles.urlWrapper}>
        <div className={styles.urlContainer}>
          <TextField
            id="url-input"
            sx={{
              ...URLInputStyles,
              ...(isAsinValid ? {} : urlErrInputStyles),
            }}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">URL</InputAdornment>
              ),
            }}
          />
          <Button sx={analyseBtnStyles} onClick={handleAnalyse}>
            Analyse
          </Button>
        </div>
        {!isAsinValid && (
          <p className={styles.invalidText}>
            *Invalid URL provided. Please provide a valid URL.
          </p>
        )}
      </div>
      {data ? (
        <React.Fragment>
          <ReviewPerformanceBox data={data} />
          <ReviewSummary reviewAnalysisData={data} onClick={onClick} />
          <ReviewScoreModal
            open={open}
            review={modalData}
            closeScoreModal={handleClose}
          />
        </React.Fragment>
      ) : (
        fetchingData && (
          <React.Fragment>
            <CircularProgress
              sx={{ color: '#77469b', alignSelf: 'center' }}
              style={{
                marginTop: '15rem',
              }}
            />
            <p
              style={{
                textAlign: 'center',
                marginTop: '0rem',
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#77469b',
              }}
            >
              {waitText}
            </p>
          </React.Fragment>
        )
      )}
    </div>
  );
};

export default ReviewAnalysisPage;
