import { imageUrls } from '@/constants/assets/images.constants';
import ImgComponent from '../../common/img-component/img-component';

export default function MobileView() {
  return (
    <div className="empty-page">
      <ImgComponent imageURL={imageUrls.anarixLogo} alt="logo" />
      <h5>
        Currently the app is not compatible in mobile view.
        <br />
        Please expand the window to continue
      </h5>
    </div>
  );
}
