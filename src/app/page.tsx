import Banner from './components/Banner';
import Services from './components/Services';
import Gallery from './components/Gallery';
import About from './components/About';
import Contact from './components/Contact';
import { getHomepageServices, getAvailableServiceTitles, getHomepageProjects } from '@/lib/service-mongo';

const HomePage = async () => {
  const [services, availableServices, projects] = await Promise.all([
    getHomepageServices(),
    getAvailableServiceTitles(),
    getHomepageProjects(),
  ]);

  return (
    <>
      <Banner />
      <Services services={services} />
      <Gallery projects={projects} />
      <About />
      <Contact availableServices={availableServices} />
    </>
  );
};

export default HomePage;