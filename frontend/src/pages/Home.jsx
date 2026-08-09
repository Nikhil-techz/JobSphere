import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import Hero from "../components/home/Hero";
import JobSearch from "../components/home/JobSearch";
import RoleSelection from "../components/home/RoleSelection";

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <Hero />
        <JobSearch />
        <RoleSelection />
      </main>

      <Footer />
    </div>
  );
}

export default Home;
