import { SiteHeader } from '@/components/layout/site-header';
import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { DonationCategories } from '@/components/sections/donation-categories';
import { MembershipSection } from '@/components/sections/membership-section';
import { SiteFooter } from '@/components/layout/site-footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <DonationCategories />
        <MembershipSection />
      </main>
      <SiteFooter />
    </div>
  );
}
