'use client';

import React, { useState } from 'react';
import {
  MonitorCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { updateWebsiteCMS } from '@/app/actions/school-actions';
import Link from 'next/link';

export function CMSView({
  cmsItems,
  userRole,
}: {
  cmsItems: any[];
  userRole: string;
}) {
  const [selectedKey, setSelectedKey] = useState(cmsItems[0]?.sectionKey || 'HERO_WELCOME');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const activeItem = cmsItems.find((c) => c.sectionKey === selectedKey) || cmsItems[0];
  const [title, setTitle] = useState(activeItem?.title || '');
  const [subtitle, setSubtitle] = useState(activeItem?.subtitle || '');
  const [content, setContent] = useState(activeItem?.content || '');

  const handleSelectKey = (key: string) => {
    setSelectedKey(key);
    const item = cmsItems.find((c) => c.sectionKey === key);
    if (item) {
      setTitle(item.title);
      setSubtitle(item.subtitle || '');
      setContent(item.content);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const res = await updateWebsiteCMS(selectedKey, title, content, subtitle);
    if (res.success) {
      setStatusMessage({ type: 'success', text: 'Public website copy updated in database!' });
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Failed to update content.' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-pureWhite p-6 rounded-2xl border border-steelGrey/20 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-black text-midnight tracking-tight uppercase">
              Website Content Management System (CMS)
            </h1>
            <span className="bg-antiqueGold/15 text-warmGold border border-antiqueGold/30 text-xs font-heading font-bold px-2.5 py-0.5 rounded-full">
              Live Database Backed
            </span>
          </div>
          <p className="text-xs text-steelGrey mt-1">
            Edit public portal headlines, hero taglines, and principal addresses without code deployments.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-midnight hover:bg-deepNavy text-pureWhite font-heading font-bold text-xs uppercase tracking-wider shadow-sm transition"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-4 h-4 text-warmGold" />
        </Link>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-lg text-xs font-sans flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-deepEmerald/10 text-deepEmerald border border-deepEmerald/30'
              : 'bg-mutedRed/10 text-mutedRed border border-mutedRed/30'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main CMS Editor Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Section Selector */}
        <div className="md:col-span-4 bg-pureWhite rounded-2xl border border-steelGrey/20 p-4 shadow-sm space-y-2">
          <div className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-steelGrey px-2 pb-2 border-b border-slate-100">
            Select Website Section
          </div>
          {cmsItems.map((item) => (
            <button
              key={item.sectionKey}
              onClick={() => handleSelectKey(item.sectionKey)}
              className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between ${
                selectedKey === item.sectionKey
                  ? 'bg-midnight text-pureWhite border border-antiqueGold/40 shadow-sm'
                  : 'hover:bg-warmIvory/60 text-charcoal'
              }`}
            >
              <div>
                <div className="font-heading font-bold text-xs">
                  {item.sectionKey === 'HERO_WELCOME' ? 'Hero Banner & Tagline' : 'Principal Executive Message'}
                </div>
                <div className="text-[10px] opacity-75 font-mono">{item.sectionKey}</div>
              </div>
              <Edit3 className="w-3.5 h-3.5 text-warmGold" />
            </button>
          ))}
        </div>

        {/* Right Editor Form */}
        <div className="md:col-span-8 bg-pureWhite rounded-2xl border border-steelGrey/20 p-6 shadow-sm space-y-5">
          <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                Main Headline / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal font-semibold text-sm focus:outline-none focus:ring-1 focus:ring-antiqueGold"
              />
            </div>

            <div>
              <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                Subtitle / Author / Tagline
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
              />
            </div>

            <div>
              <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                Body Content Paragraph
              </label>
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal leading-relaxed focus:outline-none focus:ring-1 focus:ring-antiqueGold"
              />
            </div>

            {userRole === 'ADMIN' && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider shadow-sm transition"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save & Publish Live'}</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
