import Banner from './components/Banner';
import Services from './components/Services';
import Gallery from './components/Gallery';
import About from './components/About';
import Contact from './components/Contact';
import { getHomepageServices, getAvailableServiceTitles } from '@/lib/service-mongo';

const HomePage = async () => {
  const [services, availableServices] = await Promise.all([
    getHomepageServices(),
    getAvailableServiceTitles(),
  ]);

  return (
    <>
      <Banner />
      <Services services={services} />
      <Gallery />
      <About />
      <Contact availableServices={availableServices} />
    </>
  );
};

export default HomePage;