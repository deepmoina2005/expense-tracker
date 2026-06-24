import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import DashboardPreview from '../components/landing/DashboardPreview';
import Pricing from '../components/landing/Pricing';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  // Theme is handled globally in App.jsx

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <Pricing />
      <Footer />
    </div>
  );
};

export default LandingPage;