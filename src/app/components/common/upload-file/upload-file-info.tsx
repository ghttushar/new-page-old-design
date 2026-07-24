import { imageUrls } from '@/constants/assets/images.constants';
import { formatFileSize } from 'src/utils/advertising.utils';
import ImgComponent from '../img-component/img-component';
import { containerStyles, infoTextStyles } from './upload-file-info-styles';
const UploadFileInfo: React.FC<{ uploadedFile: File }> = ({ uploadedFile }) => {
  return (
    <div style={containerStyles}>
      <div
        id="file-name"
        style={{
          width: '22rem',
        }}
      >
        {' '}
        <span style={infoTextStyles}>
          File Name <br />
        </span>
        <span
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '0.8rem',
            marginTop: '0.5rem',
            alignItems: 'center',
          }}
        >
          <ImgComponent
            imageURL={imageUrls.excelImg}
            alt="file-icon"
            customStyles={{
              width: '1.4rem',
              height: '1.4rem',
            }}
          />
          <span
            style={{
              maxWidth: '20rem',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
            title={uploadedFile.name}
          >
            {uploadedFile.name}
          </span>
        </span>
      </div>
      <div
        id="file-size"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignContent: 'flex-start',
        }}
      >
        <span style={infoTextStyles}>File Size </span>
        {formatFileSize(uploadedFile.size)}
      </div>
    </div>
  );
};

export default UploadFileInfo;
