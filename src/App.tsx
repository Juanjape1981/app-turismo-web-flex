import { BrowserRouter,  Routes } from "react-router-dom";
import { renderRoutes, routes } from "./router/index";
// import './styles/pages/App.scss'
const App = () => {
  return (

    <BrowserRouter>
      <Routes>
        {renderRoutes(routes)}
      </Routes>
    </BrowserRouter>
  );
};

export default App;