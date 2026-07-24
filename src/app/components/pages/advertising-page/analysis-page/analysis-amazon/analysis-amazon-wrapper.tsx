import { Route, Routes } from 'react-router-dom';
import AnalysisOverallRoutes from './overall/account-lvl/analysis-overall-routes';
import AnalysisSBRoutes from './sb/account-lvl/amazon-sb.routes';
import AnalysisSDRoutes from './sd/account-lvl/analysis-sd-routes';
import AnalysisSPRoutes from './sp/account-lvl/analysis-sp-routes';

function AnalysisAmazonWrapper() {
  return (
    <Routes>
      <Route path="/sp/*" element={<AnalysisSPRoutes />} />
      <Route path="/sb/*" element={<AnalysisSBRoutes />} />
      <Route path="/sd/*" element={<AnalysisSDRoutes />} />
      <Route path="/all/*" element={<AnalysisOverallRoutes />} />
      <Route path="/*" element={<AnalysisSPRoutes />} />
    </Routes>
  );
}

export default AnalysisAmazonWrapper;
