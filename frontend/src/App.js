import { BrowserRouter, Routes, Route } from "react-router-dom";
import CategorySelect from "./components/CategorySelect";
import TestPage from "./components/TestPage";
import ResultPage from "./components/ResultPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ScholarshipFilter from "./components/ScholarshipFilter";
import ScholarshipPage from "./components/ScholarshipPage";
import UGChoice from "./components/UGChoice";
import AdminRoute from "./components/AdminRoute";
import AdminScholarship from "./components/AdminScholarship";
import AdminScholarshipEdit from "./components/AdminScholarshipEdit";
function App() {
  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/category" element={<CategorySelect />} />
        <Route path="/ug-choice" element={<UGChoice />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/scholarship-filter" element={<ScholarshipFilter />} />
        <Route path="/scholarships" element={<ScholarshipPage />} />
       
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminScholarship />
            </AdminRoute>
          }
        />
        <Route
  path="/admin/scholarships/edit/:id"
  element={
    <AdminRoute>
      <AdminScholarshipEdit />
    </AdminRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
