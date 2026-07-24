import { Route, Routes } from 'react-router-dom';
import AnalysisOverallRoutes from './overall/account-lvl/analysis-overall-routes';
import AnalysisSBRoutes from './sb/account-lvl/analysis-sb-routes';
import AnalysisSPRoutes from './sp/account-lvl/analysis-sp-routes';
import AnalysisSVRoutes from './sv/account-lvl/analysis-sv-routes';

function AnalysisWalmartWrapper() {
  return (
    <Routes>
      <Route path="/sp/*" element={<AnalysisSPRoutes />} />
      <Route path="/sb/*" element={<AnalysisSBRoutes />} />
      <Route path="/sv/*" element={<AnalysisSVRoutes />} />
      <Route path="/all/*" element={<AnalysisOverallRoutes />} />
      <Route path="/*" element={<AnalysisSPRoutes />} />
    </Routes>
  );
}

export default AnalysisWalmartWrapper;
