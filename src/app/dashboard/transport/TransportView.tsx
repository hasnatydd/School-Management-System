'use client';

import React, { useState } from 'react';
import {
  Bus,
  MapPin,
  Clock,
  Phone,
  Users,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { createTransportRoute } from '@/app/actions/school-actions';
import { formatCurrency } from '@/lib/utils';

export function TransportView({
  routes,
  userRole,
}: {
  routes: any[];
  userRole: string;
}) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCreateRoute = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const formData = new FormData(e.currentTarget);
    const res = await createTransportRoute(formData);

    if (res.success) {
      setStatusMessage({ type: 'success', text: 'School bus route registered successfully!' });
      setCreateModalOpen(false);
      window.location.reload();
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Failed to create route.' });
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
              Fleet Transport & GPS Shuttle Logistics
            </h1>
            <span className="bg-antiqueGold/15 text-warmGold border border-antiqueGold/30 text-xs font-heading font-bold px-2.5 py-0.5 rounded-full">
              {routes.length} Active Routes
            </span>
          </div>
          <p className="text-xs text-steelGrey mt-1">
            Climate-controlled institutional bus routes across Uttara, Banani, Gulshan, and Dhanmondi zones.
          </p>
        </div>

        {userRole === 'ADMIN' && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Route</span>
          </button>
        )}
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

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => {
          const passengerCount = route.passengers?.length || 0;
          const availableSeats = route.capacity - passengerCount;

          return (
            <div
              key={route.id}
              className="bg-pureWhite rounded-2xl border border-steelGrey/20 shadow-sm p-6 flex flex-col justify-between hover:border-antiqueGold/50 transition group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-midnight text-warmGold border border-antiqueGold/30">
                    <Bus className="w-5 h-5 text-warmGold" />
                  </div>
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-warmIvory text-midnight border border-slate-200">
                    {route.vehicleNumber}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-base text-midnight group-hover:text-antiqueGold transition">
                    {route.routeName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-antiqueGold font-bold mt-1">
                    <span>Fare: {formatCurrency(route.monthlyFare)} / month</span>
                  </div>
                </div>

                {/* Driver Details */}
                <div className="p-3 rounded-xl bg-warmIvory/60 border border-slate-200 space-y-1 text-xs">
                  <div className="font-heading font-bold text-midnight">
                    Driver: {route.driverName}
                  </div>
                  <div className="flex items-center gap-1.5 text-steelGrey">
                    <Phone className="w-3.5 h-3.5 text-antiqueGold" />
                    <span>{route.driverPhone}</span>
                  </div>
                </div>

                {/* Stops */}
                <div>
                  <div className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-steelGrey mb-1.5">
                    Designated Pick-up Stops:
                  </div>
                  <div className="space-y-1.5">
                    {route.stops?.map((stop: any) => (
                      <div
                        key={stop.id}
                        className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0"
                      >
                        <span className="flex items-center gap-1.5 text-charcoal">
                          <MapPin className="w-3.5 h-3.5 text-antiqueGold" />
                          {stop.stopName}
                        </span>
                        <span className="font-mono text-[10px] text-steelGrey">
                          {stop.pickupTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Capacity Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-steelGrey" />
                  <span className="font-semibold text-charcoal">
                    {passengerCount} / {route.capacity} Seats
                  </span>
                </div>
                <span
                  className={`font-heading font-bold text-[11px] uppercase ${
                    availableSeats > 0 ? 'text-deepEmerald' : 'text-mutedRed'
                  }`}
                >
                  {availableSeats > 0 ? `${availableSeats} Available` : 'Full'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Route Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-pureWhite rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-heading font-bold text-midnight uppercase tracking-wider">
                Register New Bus Route
              </h2>
              <button onClick={() => setCreateModalOpen(false)} className="text-steelGrey hover:text-midnight">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoute} className="mt-4 space-y-4 text-xs font-sans">
              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Route Name & Zones
                </label>
                <input
                  type="text"
                  name="routeName"
                  required
                  placeholder="e.g. Route 4: Mirpur DOHS - Cantonment Shuttle"
                  className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                    Vehicle License Plate
                  </label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    required
                    placeholder="e.g. DHA-METRO-CHA-14-9988"
                    className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                  />
                </div>

                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                    Passenger Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    defaultValue="30"
                    required
                    className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                    Driver Full Name
                  </label>
                  <input
                    type="text"
                    name="driverName"
                    required
                    placeholder="e.g. Mohammad Harun"
                    className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                  />
                </div>

                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                    Driver Hotline
                  </label>
                  <input
                    type="text"
                    name="driverPhone"
                    required
                    placeholder="e.g. +880 1712 345678"
                    className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Monthly Transport Fare
                </label>
                <input
                  type="number"
                  name="monthlyFare"
                  defaultValue="3500"
                  required
                  className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-charcoal font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider shadow-sm transition"
                >
                  {loading ? 'Registering...' : 'Register Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
