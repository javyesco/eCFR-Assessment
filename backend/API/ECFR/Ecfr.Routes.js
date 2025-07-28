import express from 'express';
import EcfrControllers from "../../Controller/ECFR-Controllers/Ecfr.Controllers.js";

const EcfrRouter = express.Router();

// Download and store eCFR data
EcfrRouter.post('/download', EcfrControllers.apiDownloadAndStoreAgencies);

// Get stored agencies
EcfrRouter.get('/agencies', EcfrControllers.apiGetAgencies);

// Analysis endpoints
EcfrRouter.get('/analysis/word-count', EcfrControllers.apiGetWordCountAnalysis);
EcfrRouter.get('/analysis/checksums', EcfrControllers.apiGetAgencyChecksums);
EcfrRouter.get('/analysis/history', EcfrControllers.apiGetHistoricalChanges);
EcfrRouter.get('/analysis/complexity', EcfrControllers.apiGetComplexityScore);

export default EcfrRouter;
