import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"

import CustomRoutes from "./Routes";
import NavBar from "./component/basic/NavBar";

function App() {
  return (
      <div className="page-container">
          <div className="content-wrap">
              <NavBar />
              <CustomRoutes />
          </div>
      </div>
  );
}

export default App;
