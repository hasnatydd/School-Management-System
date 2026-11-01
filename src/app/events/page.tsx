import React from 'react';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';

export default function EventsPage() {
  const events = [
    {
      title: 'Inter-School STEM & Robotics Fair 2026',
      date: 'November 18, 2026',
      time: '09:00 AM – 03:30 PM',
      venue: 'Central Auditorium & STEM Pavilion, Sonargaon Campus',
      category: 'Science & Robotics',
      desc: 'Annual competitive showcase featuring autonomous rover robotics, environmental science prototypes, and mathematics riddle showdowns with 12 visiting international academies.',
    },
    {
      title: 'Midterm Parent-Teacher Academic Conference',
      date: 'November 24, 2026',
      time: '08:30 AM – 01:00 PM',
      venue: 'Senior & Junior Academic Wings, Level 2',
      category: 'Academic Consultations',
      desc: 'One-on-one structured progress dialogues between guardians and homeroom mentors to review midterm gradebooks, attendance compliance, and personalized target setting.',
    },
    {
      title: 'Winter Track & Field Athletics Invitational',
      date: 'December 05, 2026',
      time: '08:00 AM – 02:00 PM',
      venue: 'Astroturf Athletics Complex & Sports Pavilion',
      category: 'Sports & Athletics',
      desc: 'House-vs-house athletics championship including 100m sprint heats, high jump, relay, and football finals presided over by national sports federation representatives.',
    },
    {
      title: 'Victory Day Cultural Assembly & Patriotic Chorus',
      date: 'December 15, 2026',
      time: '10:00 AM – 12:30 PM',
      venue: 'Main Campus Amphitheater',
      category: 'National Heritage',
      desc: 'Commemorating Bangladesh Victory Day with historical drama enactments, traditional patriotic choral performances by the Primary Wing, and address by freedom fighter dignitaries.',
    },
    {
      title: 'Cambridge IGCSE Mock Examination Session',
      date: 'January 10 – January 22, 2027',
      time: '08:30 AM – 12:00 PM',
      venue: 'Official Exam Halls A & B',
      category: 'Examinations',
      desc: 'Full-dress diagnostic mock papers for Grade 9 and Grade 10 scholars in Additional Mathematics, Physics, Chemistry, English, and Bangladesh Studies under invigilation.',
    },
  ];

  return (
    <div className="min-h-screen bg-warmIvory text-charcoal flex flex-col font-sans selection:bg-antiqueGold selection:text-midnight">
      <PublicNavbar />

      <section className="bg-midnight py-16 sm:py-20 text-pureWhite border-b-2 border-antiqueGold/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-deepNavy border border-antiqueGold/30 text-warmGold text-[11px] font-heading font-bold uppercase tracking-widest">
            Institutional Calendar
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight">
            Upcoming School Events
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl leading-relaxed">
            Academic milestones, science exhibitions, parliamentary debate championships, parent consultations, and cultural celebrations.
          </p>
        </div>
      </section>

      <section className="py-20 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {events.map((ev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-warmIvory/40 border border-steelGrey/20 hover:border-antiqueGold/60 transition shadow-sm flex flex-col sm:flex-row items-start gap-6"
            >
              {/* Date Box */}
              <div className="w-full sm:w-28 p-3 rounded-xl bg-midnight text-warmGold text-center font-heading font-bold flex-shrink-0 shadow-subtle border border-antiqueGold/30">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-antiqueGold" />
                <div className="text-xs uppercase font-mono tracking-wider">{ev.date.split(',')[0]}</div>
                <div className="text-[10px] text-slate-300 font-normal">{ev.date.split(',')[1] || '2026'}</div>
              </div>

              {/* Event Content */}
              <div className="space-y-2 flex-1">
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-deepNavy text-warmGold border border-antiqueGold/30">
                  {ev.category}
                </div>
                <h3 className="font-heading font-bold text-xl text-midnight">{ev.title}</h3>
                <p className="text-xs sm:text-sm text-charcoal/80 font-sans leading-relaxed">{ev.desc}</p>
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-steelGrey font-mono">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-antiqueGold" /> {ev.time}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-antiqueGold" /> {ev.venue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
