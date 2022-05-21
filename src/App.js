import Table from "./components/Table";
import Menu from "./components/Menu";
import {
  BrowserRouter as HashRouter,
  Routes, Route
} from "react-router-dom"

export default function App() {
  
  return (
    <HashRouter forceRefresh={true} basename={process.env.PUBLIC_URL + '/'}>
      <Routes>
        <Route path="/" exact element = {<Menu />} />
        <Route path="/game/:gameId" exact element={<Table />} />
      </Routes>
    </HashRouter>
  );
};