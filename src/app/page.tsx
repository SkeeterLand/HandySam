import Banner from './components/Banner';
import Services from './components/Services'; 
import Gallery from './components/Gallery';
import About from './components/About';
import Contact from './components/Contact';

const HomePage = () => {
  return (
    <>
      <Banner />
      <Services /> 
      <Gallery /> 
      <About />
      <Contact />
    </>
  );
};

export default HomePage;