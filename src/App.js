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
        <Route path="/" element = {<Menu />} />
        <Route path="/game/:gameId" element={<Table />} />
      </Routes>
    </HashRouter>
  );
};