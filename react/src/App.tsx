import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';

const Login = React.lazy(() => import('./pages/admin/Login'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminLayout = React.lazy(() => import('./layout/AdminLayout'));
const HeroAdmin = React.lazy(() => import('./pages/admin/HeroAdmin'));
const AboutAdmin = React.lazy(() => import('./pages/admin/AboutAdmin'));
const SkillsAdmin = React.lazy(() => import('./pages/admin/SkillsAdmin'));
const ExperienceAdmin = React.lazy(() => import('./pages/admin/ExperienceAdmin'));
const EducationAdmin = React.lazy(() => import('./pages/admin/EducationAdmin'));
const ProjectsAdmin = React.lazy(() => import('./pages/admin/ProjectsAdmin'));
const ResumeAdmin = React.lazy(() => import('./pages/admin/ResumeAdmin'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#050505] text-white">Loading...</div>}>
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
          <Route path="/portal/login" element={<Login />} />

          <Route path="/portal" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="hero" element={<HeroAdmin />} />
            <Route path="about" element={<AboutAdmin />} />
            <Route path="skills" element={<SkillsAdmin />} />
            <Route path="experience" element={<ExperienceAdmin />} />
            <Route path="education" element={<EducationAdmin />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="resume" element={<ResumeAdmin />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
