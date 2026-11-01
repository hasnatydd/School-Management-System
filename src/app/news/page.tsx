import React from 'react';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

export default function NewsBlogPage() {
  const articles = [
    {
      id: '1',
      title: 'Sonargaon Scholars Clinch Top Honors at Bangladesh National Science Olympiad 2026',
      date: 'October 24, 2026',
      author: 'Academic Directorate',
      category: 'Academic Milestone',
      summary:
        'A delegation of five senior secondary scholars from Grade 10 earned first place honors in the National Science Olympiad for their experimental robotics filtration model addressing urban micro-plastics.',
      img: '/images/stem-lab.jpg',
    },
    {
      id: '2',
      title: 'New High-Performance Robotics and Artificial Intelligence Terminal Inaugurated',
      date: 'October 12, 2026',
      author: 'Technology Directorate',
      category: 'Campus Development',
      summary:
        'The Board of Trustees has inaugurated our expanded AI computation lab, equipping Grades 6 through 10 with dedicated Python, microcontroller programming, and algorithmic design suites.',
      img: '/images/people/teacher-tanvir.jpg',
    },
    {
      id: '3',
      title: 'Cambridge Assessment International Education Recognizes Sonargaon Top-in-Country Laureates',
      date: 'September 28, 2026',
      author: 'Dean of Academics',
      category: 'Cambridge Honors',
      summary:
        'Cambridge Assessment has officially honored our scholars for achieving the highest individual grades nationally in Additional Mathematics, Physics, and English Language in the recent examination session.',
      img: '/images/students-group.jpg',
    },
    {
      id: '4',
      title: 'Annual Inter-House Sports Championship: Track & Field Gold Trophies Awarded',
      date: 'September 15, 2026',
      author: 'Athletics Department',
      category: 'Athletics & Sports',
      summary:
        'Scholars exhibited extraordinary athletic sportsmanship and team camaraderie in the annual track and field meet, breaking three school records.',
      img: '/images/sports-students.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-warmIvory text-charcoal flex flex-col font-sans selection:bg-antiqueGold selection:text-midnight">
      <PublicNavbar />

      <section className="bg-midnight py-16 sm:py-20 text-pureWhite border-b-2 border-antiqueGold/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-deepNavy border border-antiqueGold/30 text-warmGold text-[11px] font-heading font-bold uppercase tracking-widest">
            Institutional Editorial
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight">
            News, Articles & Chronicles
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl leading-relaxed">
            Scholastic accomplishments, campus developments, research symposiums, and community initiatives at Sonargaon International School.
          </p>
        </div>
      </section>

      <section className="py-20 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((item) => (
              <article
                key={item.id}
                className="bg-warmIvory/40 rounded-2xl overflow-hidden border border-steelGrey/20 shadow-sm hover:border-antiqueGold/50 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-60 overflow-hidden relative">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-midnight/90 backdrop-blur-sm text-warmGold text-[10px] font-heading font-bold uppercase tracking-wider px-3 py-1 rounded border border-antiqueGold/40">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-steelGrey font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-antiqueGold" />
                        {item.date}
                      </span>
                      <span>•</span>
                      <span>By {item.author}</span>
                    </div>

                    <h3 className="font-heading font-bold text-xl text-midnight leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-charcoal/80 font-sans leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <span className="text-xs font-heading font-bold text-midnight hover:text-antiqueGold inline-flex items-center gap-1.5 cursor-pointer">
                    Read Complete Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
