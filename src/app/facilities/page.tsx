import React from 'react';
import prisma from '@/lib/prisma';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Building2, Cpu, BookOpen, Trophy, ShieldCheck, Bus, Utensils, Sparkles } from 'lucide-react';

export default async function FacilitiesPage() {
  const setting = await prisma.schoolSetting.findUnique({ where: { id: 'default' } });

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

  const facilities = [
    {
      title: 'STEM & Advanced Robotics Hub',
      icon: Cpu,
      img: '/images/stem-lab.jpg',
      desc: 'Our flagship innovation lab equipped with Arduino microcontrollers, Raspberry Pi workstations, 3D rapid prototyping, and algorithmic coding terminals for primary and secondary scholars.',
    },
    {
      title: 'Experimental Physics & Chemistry Suites',
      icon: Building2,
      img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
      desc: 'High-specification wet and dry laboratories adhering to Cambridge practical assessment standards. Individual optical and spectrophotometric work benches with certified fume hoods.',
    },
    {
      title: 'Central Scholastic Library & Digital Archive',
      icon: BookOpen,
      img: '/images/library-students.jpg',
      desc: 'A quiet sanctuary housing over 15,000 physical volumes, Cambridge curriculum guides, literary classics, and JSTOR digital research access for senior scholar dissertations.',
    },
    {
      title: 'All-Weather Astroturf Athletics Complex',
      icon: Trophy,
      img: '/images/sports-students.jpg',
      desc: 'FIFA-grade shock-absorbent turf hosting inter-school football leagues, cricket nets, basketball courts, and athletics tracks overseen by licensed physical conditioning coaches.',
    },
    {
      title: 'Acoustic Auditorium & Performing Amphitheater',
      icon: Sparkles,
      img: '/images/students-group.jpg',
      desc: 'A 600-seat theatrical hall engineered with surround acoustics, stage lighting, and multimedia projection for parliamentary debates, annual musical galas, and academic ceremonies.',
    },
    {
      title: 'Hygienic Dining Hall & Nutritional Cafeteria',
      icon: Utensils,
      img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      desc: 'Supervised meal preparation providing hot, dietitian-approved lunches and healthy snacks. Strict hygiene audits ensure exceptional nutritional standards for growing minds.',
    },
    {
      title: 'Air-Conditioned GPS Fleet Transport',
      icon: Bus,
      img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
      desc: 'Dedicated fleet of modern air-conditioned buses serving Uttara, Banani, Gulshan, Baridhara, Dhanmondi, and Mirpur with live parent GPS tracking and trained security attendants.',
    },
    {
      title: 'Health Infirmatory & Emergency Response',
      icon: ShieldCheck,
      img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
      desc: 'Full-time registered nursing staff, first-aid stations, isolation recovery bays, and direct priority emergency tie-ups with leading Dhaka specialized hospitals.',
    },
  ];

  return (
    <div className="min-h-screen bg-warmIvory text-charcoal flex flex-col font-sans selection:bg-antiqueGold selection:text-midnight">
      <PublicNavbar schoolSettings={schoolSettings} />

      {/* Header Banner */}
      <section className="bg-midnight py-16 sm:py-20 text-pureWhite border-b-2 border-antiqueGold/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-deepNavy border border-antiqueGold/30 text-warmGold text-[11px] font-heading font-bold uppercase tracking-widest">
            Campus Infrastructure & Resources
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight">
            World-Class Facilities
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl leading-relaxed">
            Every square meter of our campus is engineered to inspire academic inquiry, foster physical vitality, and safeguard scholar wellbeing.
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-20 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {facilities.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-warmIvory/40 rounded-2xl overflow-hidden border border-steelGrey/20 shadow-sm hover:border-antiqueGold/50 transition duration-300 flex flex-col">
                  <div className="h-56 overflow-hidden relative">
                    <img src={f.img} alt={f.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-antiqueGold mb-1.5">
                        <Icon className="w-5 h-5" />
                        <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-steelGrey">
                          Sonargaon Campus
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-xl text-midnight">{f.title}</h3>
                      <p className="text-xs text-charcoal/80 mt-2 font-sans leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <PublicFooter schoolSettings={schoolSettings} />
    </div>
  );
}
