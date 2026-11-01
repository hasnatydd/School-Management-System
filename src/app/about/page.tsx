import React from 'react';
import prisma from '@/lib/prisma';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Target, Compass } from 'lucide-react';

export default async function AboutPage() {
  const setting = await prisma.schoolSetting.findUnique({
    where: { id: 'default' },
  });

  const schoolSettings = {
    schoolName: setting?.schoolName || 'SONARGAON INTERNATIONAL SCHOOL',
    tagline: setting?.tagline || 'Building Character. Inspiring Excellence.',
    email: setting?.email || 'admissions@sonargaon.edu.bd',
    phone: setting?.phone || '+880 2 8876543',
    address: setting?.address || 'Plot 14, Road 7, Sector 3, Uttara / Banani, Dhaka, Bangladesh',
    academicYear: setting?.academicYear || '2026-2027',
    currency: setting?.currency || '৳',
    timeZone: setting?.timeZone || 'Asia/Dhaka',
    country: setting?.country || 'Bangladesh',
  };

  return (
    <div className="min-h-screen bg-warmIvory text-charcoal flex flex-col font-sans selection:bg-antiqueGold selection:text-midnight">
      <PublicNavbar schoolSettings={schoolSettings} />

      {/* Hero Banner */}
      <section className="bg-midnight py-16 sm:py-20 text-pureWhite border-b-2 border-antiqueGold/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-deepNavy border border-antiqueGold/30 text-warmGold text-[11px] font-heading font-bold uppercase tracking-widest">
            Institutional Legacy & Governance
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight">
            About Sonargaon International School
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl leading-relaxed">
            Building Character. Inspiring Excellence. A quarter-century legacy of nurturing principled leaders, critical thinkers, and global scholars in Dhaka, Bangladesh.
          </p>
        </div>
      </section>

      {/* Main Narrative & History */}
      <section className="py-16 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-heading font-bold text-antiqueGold tracking-widest uppercase">
                School History & Heritage
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-midnight uppercase tracking-tight">
                Rooted in Bengal’s Historic Seat of Wisdom
              </h2>
              <p className="text-sm text-charcoal leading-relaxed">
                Named after ancient Sonargaon—the historic medieval capital renowned for scholarly discourse, trade, and architectural artistry—Sonargaon International School was founded with a singular aspiration: to establish a world-class center of primary and secondary education in Bangladesh that rivals global private academies.
              </p>
              <p className="text-sm text-charcoal leading-relaxed">
                Beginning as an intimate community of scholars and dedicated Cambridge educators, the school expanded over two decades into an expansive, state-of-the-art campus spanning Grades 1 through 10. Our graduates consistently achieve top rankings in national and international examinations while epitomizing humility, ethics, and service.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-warmIvory/60 border border-steelGrey/20">
                  <div className="font-heading font-bold text-midnight text-lg">2001</div>
                  <div className="text-xs text-steelGrey font-medium">Foundation of Campus</div>
                </div>
                <div className="p-4 rounded-xl bg-warmIvory/60 border border-steelGrey/20">
                  <div className="font-heading font-bold text-midnight text-lg">Cambridge Accredited</div>
                  <div className="text-xs text-steelGrey font-medium">International Standards</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border-2 border-antiqueGold/40 shadow-elevated">
                <img
                  src="/images/campus-building.jpg"
                  alt="Historic Campus Quad"
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-warmIvory/60 border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-pureWhite border border-steelGrey/20 shadow-card space-y-4">
              <div className="w-12 h-12 rounded-xl bg-midnight text-warmGold flex items-center justify-center">
                <Target className="w-6 h-6 text-warmGold" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-midnight uppercase">Our Mission</h3>
              <p className="text-sm text-charcoal leading-relaxed font-sans">
                To empower students from diverse backgrounds through an intellectually stimulating, Cambridge-aligned curriculum that instills rigorous inquiry, creative resilience, and moral discipline. We cultivate ethical leaders equipped to navigate global challenges while serving the social advancement of Bangladesh.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-pureWhite border border-steelGrey/20 shadow-card space-y-4">
              <div className="w-12 h-12 rounded-xl bg-midnight text-warmGold flex items-center justify-center">
                <Compass className="w-6 h-6 text-warmGold" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-midnight uppercase">Our Vision</h3>
              <p className="text-sm text-charcoal leading-relaxed font-sans">
                To be universally recognized as the preeminent international school in South Asia, revered for uncompromising academic scholarship, pioneering STEM and laboratory innovation, and graduating young men and women of unassailable character.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Messages: Chairman & Principal */}
      <section className="py-20 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Chairman */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 text-center space-y-3">
              <div className="w-40 h-40 rounded-2xl bg-midnight border-4 border-antiqueGold mx-auto overflow-hidden shadow-elevated">
                <img
                  src="/images/people/chairman.jpg"
                  alt="Prof. Dr. Syed Ahsan Habib - Chairman of Governing Body"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-heading font-bold text-lg text-midnight uppercase">Prof. Dr. Syed Ahsan Habib</h4>
              <p className="text-xs text-antiqueGold font-heading font-bold uppercase">Chairman, Board of Trustees</p>
              <p className="text-[11px] text-steelGrey">Former Dean of Engineering, BUET</p>
            </div>
            <div className="lg:col-span-8 space-y-3 font-sans">
              <span className="text-xs font-heading font-bold text-antiqueGold tracking-widest uppercase">
                Chairman's Perspective
              </span>
              <h3 className="font-heading font-bold text-2xl text-midnight uppercase">
                Custodians of Character and Scientific Progress
              </h3>
              <p className="text-sm text-charcoal leading-relaxed">
                "Our commitment at Sonargaon International School is steadfast: to provide an educational haven where intellectual ambition flourishes unencumbered by mediocrity. We invest continuously in our faculty, our robotics and scientific infrastructure, and our ethical culture so that every child entrusted to our care receives nothing short of world-class instruction."
              </p>
            </div>
          </div>

          <div className="border-t border-steelGrey/20 pt-16">
            {/* Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3 font-sans order-2 lg:order-1">
                <span className="text-xs font-heading font-bold text-antiqueGold tracking-widest uppercase">
                  Principal's Philosophy
                </span>
                <h3 className="font-heading font-bold text-2xl text-midnight uppercase">
                  Nurturing the Whole Scholar
                </h3>
                <p className="text-sm text-charcoal leading-relaxed">
                  "Academic excellence and character formation are not opposing ideals; they are interdependent pillars. We challenge our scholars to think deeply, speak articulately, question courageously, and conduct their lives with irreproachable honesty. That is the Sonargaon creed."
                </p>
              </div>
              <div className="lg:col-span-4 text-center space-y-3 order-1 lg:order-2">
                <div className="w-40 h-40 rounded-2xl bg-midnight border-4 border-antiqueGold mx-auto overflow-hidden shadow-elevated">
                  <img
                    src="/images/people/principal.jpg"
                    alt="Dr. Mansur Ali Chowdhury - Principal"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-heading font-bold text-lg text-midnight uppercase">Dr. Mansur Ali Chowdhury</h4>
                <p className="text-xs text-antiqueGold font-heading font-bold uppercase">Director of Academics & Principal</p>
                <p className="text-[11px] text-steelGrey">Ph.D. (Curriculum), M.Ed. (Excellence in Leadership)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Values & Ethos */}
      <section className="py-20 bg-midnight text-pureWhite border-b-2 border-antiqueGold/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-heading font-bold text-warmGold tracking-widest uppercase">
              Core Principles
            </span>
            <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight">
              Our Foundational School Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Academic Rigor', desc: 'Pursuing mastery, intellectual resilience, and critical clarity in all fields.' },
              { title: 'Moral Integrity', desc: 'Uncompromising honesty, personal accountability, and ethical citizenship.' },
              { title: 'Cultural Grounding', desc: 'Reverence for Bangladeshi heritage, language, and constitutional patriotism.' },
              { title: 'Global Vision', desc: 'Equipping scholars with multilingual poise and international competence.' },
            ].map((v, i) => (
              <div key={i} className="p-6 rounded-xl bg-deepNavy/80 border border-antiqueGold/30 space-y-2">
                <h4 className="font-heading font-bold text-warmGold text-base uppercase">{v.title}</h4>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter schoolSettings={schoolSettings} />
    </div>
  );
}
