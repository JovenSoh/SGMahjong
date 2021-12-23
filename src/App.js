import Table from "./components/Table";
import Menu from "./components/Menu";
import {
  BrowserRouter as HashRouter,
  Routes, Route
} from "react-router-dom"

export default function App() {
  
  return (
    <HashRouter>
      <Routes>
        <Route path="/SGMahjong" element = {<Menu />} />
        <Route path="/SGMahjong/game/:gameId" element={<Table />} />
      </Routes>
    </HashRouter>
  );
};