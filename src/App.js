import Table from "./components/Table";
import Menu from "./components/Menu";
import {
  BrowserRouter as Router,
  Routes, Route
} from "react-router-dom"

export default function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/sgmahjong" element = {<Menu />} />
        <Route path="/sgmahjong/game/:gameId" element={<Table />} />
      </Routes>
    </Router>
  );
};