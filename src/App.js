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
        <Route path="/" element = {<Menu />} />
        <Route path="/game/:gameId" element={<Table />} />
      </Routes>
    </Router>
  );
};