import { Route, Routes } from "react-router-dom";
import EcfrFeed from "./component/ecfr/ecfrFeed";
import EcfrDownloadPane from "./component/ecfr/downloadAgenciesPane/ecfrDownloadPane";
import EcfrWordCountPane from "./component/ecfr/wordCountPanes/ecfrWordCountPane";
import EcfrChecksumsPane from "./component/ecfr/checkSumsPane/ecfrChecksumsPane";
import EcfrHistoryPane from "./component/ecfr/historicalChangesPane/ecfrHistoryPane";
import EcfrComplexityPane from "./component/ecfr/complexityPanes/ecfrComplexityPane";
import {
    ECFR_AGENCIES,
    ECFR_DOWNLOAD,
    ECFR_WORD_COUNT,
    ECFR_CHECKSUMS,
    ECFR_HISTORY,
    ECFR_COMPLEXITY
} from "./constants/routes";

const CustomRoutes = ({ currentJobPage }) => {
    return (
        <Routes>
            {/* Home Route */}
            <Route exact path="/" element={<EcfrFeed />}/>
            <Route exact path={ ECFR_AGENCIES } element={<EcfrFeed />}/>
            
            {/* Analysis Routes */}
            <Route exact path={ ECFR_DOWNLOAD } element={<EcfrDownloadPane />}/>
            <Route exact path={ ECFR_WORD_COUNT } element={<EcfrWordCountPane />}/>
            <Route exact path={ ECFR_CHECKSUMS } element={<EcfrChecksumsPane />}/>
            <Route exact path={ ECFR_HISTORY } element={<EcfrHistoryPane />}/>
            <Route exact path={ ECFR_COMPLEXITY } element={<EcfrComplexityPane />}/>
        </Routes>
    )
}

export default CustomRoutes;