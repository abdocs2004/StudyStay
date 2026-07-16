
import Navbar from '../components/layout/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import FeaturedProperties from '../components/FeaturedProperties';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';
import Footer from '../../../components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <Features />
        <FeaturedProperties />
        <HowItWorks />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}