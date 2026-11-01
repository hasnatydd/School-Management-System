'use client';

import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Building, Mail, Phone, MapPin, Calendar, Globe, Clock } from 'lucide-react';
import { updateSchoolSettings } from '@/app/actions/school-actions';

interface SettingData {
  schoolName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  academicYear: string;
  currency: string;
  timeZone?: string;
  country?: string;
}

export function SettingsView({
  settings,
  userRole,
}: {
  settings: SettingData;
  userRole: string;
}) {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData(e.currentTarget);
    const res = await updateSchoolSettings(formData);

    if (res.success) {
      setSuccessMsg('Institution settings updated successfully!');
    } else {
      setErrorMsg(res.error || 'Failed to update settings');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-pureWhite p-6 rounded-2xl border border-steelGrey/20 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-midnight tracking-tight">Institution Configuration</h1>
            <span className="bg-antiqueGold/15 text-antiqueGold text-xs font-semibold px-2.5 py-0.5 rounded-full border border-antiqueGold/30">
              System ERP Settings
            </span>
          </div>
          <p className="text-xs text-steelGrey mt-1">
            School identity, letterhead credentials, fiscal operations, and timezone (Asia/Dhaka).
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-deepEmerald/10 border border-deepEmerald/20 text-deepEmerald text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-deepEmerald flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-mutedRed/10 border border-mutedRed/20 text-mutedRed text-xs rounded-xl flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-mutedRed flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-pureWhite rounded-2xl border border-steelGrey/20 shadow-sm p-6 space-y-5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-heading font-semibold text-midnight mb-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-steelGrey" />
              Official Institution Name
            </label>
            <input
              name="schoolName"
              required
              defaultValue={settings.schoolName}
              className="w-full px-3 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-xs font-heading font-bold text-midnight uppercase focus:outline-none focus:border-antiqueGold"
            />
          </div>

          <div>
            <label className="block font-heading font-semibold text-midnight mb-1">Official Motto / Tagline</label>
            <input
              name="tagline"
              defaultValue={settings.tagline}
              className="w-full px-3 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-xs text-midnight focus:outline-none focus:border-antiqueGold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-heading font-semibold text-midnight mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-steelGrey" />
              Official Email
            </label>
            <input
              name="email"
              type="email"
              defaultValue={settings.email}
              className="w-full px-3 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-xs text-midnight focus:outline-none focus:border-antiqueGold"
            />
          </div>

          <div>
            <label className="block font-heading font-semibold text-midnight mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-steelGrey" />
              Contact Phone Number
            </label>
            <input
              name="phone"
              defaultValue={settings.phone}
              className="w-full px-3 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-xs text-midnight focus:outline-none focus:border-antiqueGold"
            />
          </div>
        </div>

        <div>
          <label className="block font-heading font-semibold text-midnight mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-steelGrey" />
            Campus Physical Address
          </label>
          <input
            name="address"
            defaultValue={settings.address}
            className="w-full px-3 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-xs text-midnight focus:outline-none focus:border-antiqueGold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block font-heading font-semibold text-midnight mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-steelGrey" />
              Academic Year
            </label>
            <input
              name="academicYear"
              defaultValue={settings.academicYear}
              className="w-full px-3 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-xs font-semibold text-midnight focus:outline-none focus:border-antiqueGold"
            />
          </div>

          <div>
            <label className="block font-heading font-semibold text-midnight mb-1">Currency Symbol</label>
            <input
              name="currency"
              defaultValue={settings.currency || '৳'}
              className="w-full px-3 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-xs font-bold text-midnight focus:outline-none focus:border-antiqueGold"
            />
          </div>

          <div>
            <label className="block font-heading font-semibold text-midnight mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-steelGrey" />
              Time Zone
            </label>
            <input
              name="timeZone"
              defaultValue={settings.timeZone || 'Asia/Dhaka'}
              className="w-full px-3 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-xs text-midnight focus:outline-none focus:border-antiqueGold"
            />
          </div>

          <div>
            <label className="block font-heading font-semibold text-midnight mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-steelGrey" />
              Country
            </label>
            <input
              name="country"
              defaultValue={settings.country || 'Bangladesh'}
              className="w-full px-3 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-xs text-midnight focus:outline-none focus:border-antiqueGold"
            />
          </div>
        </div>

        {userRole === 'ADMIN' ? (
          <div className="pt-4 border-t border-steelGrey/15 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-midnight hover:bg-deepNavy text-pureWhite font-semibold text-xs rounded-xl shadow-sm border border-antiqueGold/40 transition"
            >
              <Save className="w-4 h-4 text-antiqueGold" />
              {loading ? 'Saving...' : 'Save Institutional Configuration'}
            </button>
          </div>
        ) : (
          <p className="text-steelGrey italic text-[11px]">Configuration changes restricted to Super Administrator.</p>
        )}
      </form>
    </div>
  );
}
