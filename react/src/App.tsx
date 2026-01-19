import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminLayout from './layout/AdminLayout';
import HeroAdmin from './pages/admin/HeroAdmin';
import AboutAdmin from './pages/admin/AboutAdmin';
import SkillsAdmin from './pages/admin/SkillsAdmin';
import ExperienceAdmin from './pages/admin/ExperienceAdmin';
import EducationAdmin from './pages/admin/EducationAdmin';
import ProjectsAdmin from './pages/admin/ProjectsAdmin';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Single Page App */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="hero" element={<HeroAdmin />} />
          <Route path="about" element={<AboutAdmin />} />
          <Route path="skills" element={<SkillsAdmin />} />
          <Route path="experience" element={<ExperienceAdmin />} />
          <Route path="education" element={<EducationAdmin />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          {/* Add other admin routes here later */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
