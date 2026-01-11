import TopNav from '../components/TopNav.jsx';
import HeroSection from '../components/HeroSection.jsx';
import CategoryShowcase from '../components/CategoryShowcase.jsx';
import ValuePropositions from '../components/ValuePropositions.jsx';
import BookingProcess from '../components/BookingProcess.jsx';
import Testimonials from '../components/Testimonials.jsx';
import AppDownloadBanner from '../components/AppDownloadBanner.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <TopNav />
      <main>
        <HeroSection />
        <CategoryShowcase />
        <ValuePropositions />
        <BookingProcess />
        <Testimonials />
        <AppDownloadBanner />
      </main>
      <SiteFooter />
    </div>
  );
};

export default LandingPage;
