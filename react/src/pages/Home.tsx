import HeroSection from '@/sections/HeroSection';
import ProjectsSection from '@/sections/ProjectsSection';
import ExperienceSection from '@/sections/ExperienceSection';
import EducationSection from '@/sections/EducationSection';
import AboutSection from '@/sections/AboutSection';

const Home = () => {
    return (
        <main>
            <HeroSection />
            <ProjectsSection />
            <ExperienceSection />
            <EducationSection />
            <AboutSection />
        </main>
    );
};

export default Home;
