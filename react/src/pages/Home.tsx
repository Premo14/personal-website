import Welcome from "@/sections/Welcome.tsx";
import TechStack from "@/sections/TechStack.tsx";

export default function Home() {
    return (
        <div className="h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth scrollbar-thin scrollbar-thumb-white scrollbar-track-[#121212]">
            <Welcome />
            <TechStack />
        </div>
    );
}
