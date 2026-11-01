'use client';

import React, { useState } from 'react';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = ['ALL', 'Campus Life', 'STEM & Laboratories', 'Athletics & Sports', 'Academic Community'];

  const photos = [
    {
      title: 'Robotics & STEM Innovation Lab',
      category: 'STEM & Laboratories',
      img: '/images/stem-lab.jpg',
    },
    {
      title: 'Grand Scholastic Library Study Hall',
      category: 'Campus Life',
      img: '/images/library-students.jpg',
    },
    {
      title: 'Inter-School Athletics Championship',
      category: 'Athletics & Sports',
      img: '/images/sports-students.jpg',
    },
    {
      title: 'Secondary Scholars in Campus Quad',
      category: 'Campus Life',
      img: '/images/students-group.jpg',
    },
    {
      title: 'Mathematics & Cambridge Coordinator',
      category: 'Academic Community',
      img: '/images/people/teacher-farhana.jpg',
    },
    {
      title: 'Advanced Electronics & Microcontroller Lab',
      category: 'STEM & Laboratories',
      img: '/images/people/teacher-tanvir.jpg',
    },
    {
      title: 'Parent-Teacher Consultations & Academic Forum',
      category: 'Academic Community',
      img: '/images/parents.jpg',
    },
    {
      title: 'Historic Campus Quadrangle & Architecture',
      category: 'Campus Life',
      img: '/images/campus-building.jpg',
    },
  ];

  const filtered = photos.filter(
    (p) => activeCategory === 'ALL' || p.category.toLowerCase() === activeCategory.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-warmIvory text-charcoal flex flex-col font-sans selection:bg-antiqueGold selection:text-midnight">
      <PublicNavbar />

      <section className="bg-midnight py-16 sm:py-20 text-pureWhite border-b-2 border-antiqueGold/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-deepNavy border border-antiqueGold/30 text-warmGold text-[11px] font-heading font-bold uppercase tracking-widest">
            Visual Archive
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight">
            Campus Photo Gallery
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl leading-relaxed">
            Moments of discovery, scholastic debate, athletic triumph, and camaraderie at Sonargaon International School.
          </p>
        </div>
      </section>

      <section className="py-16 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Categories Tab */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition ${
                  activeCategory === cat
                    ? 'bg-midnight text-pureWhite shadow-sm'
                    : 'bg-warmIvory/60 text-steelGrey hover:text-midnight border border-steelGrey/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden border border-steelGrey/20 shadow-sm h-64 bg-midnight"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/20 to-transparent flex flex-col justify-end p-4 text-pureWhite">
                  <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-warmGold">
                    {item.category}
                  </span>
                  <h4 className="font-heading font-bold text-sm text-pureWhite mt-0.5">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
