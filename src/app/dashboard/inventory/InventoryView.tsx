'use client';

import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { createInventoryItem } from '@/app/actions/school-actions';
import { formatCurrency } from '@/lib/utils';

export function InventoryView({
  items,
  userRole,
}: {
  items: any[];
  userRole: string;
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filtered = items.filter((item) => {
    const matchSearch =
      item.itemName.toLowerCase().includes(search.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const totalValuation = items.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const formData = new FormData(e.currentTarget);
    const res = await createInventoryItem(formData);

    if (res.success) {
      setStatusMessage({ type: 'success', text: 'Inventory asset registered successfully!' });
      setAddModalOpen(false);
      window.location.reload();
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Failed to add item.' });
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
              Campus Equipment & Inventory Assets
            </h1>
            <span className="bg-antiqueGold/15 text-warmGold border border-antiqueGold/30 text-xs font-heading font-bold px-2.5 py-0.5 rounded-full">
              {items.length} Tracked Assets
            </span>
          </div>
          <p className="text-xs text-steelGrey mt-1">
            Science laboratory apparatus, robotics hardware, athletic gear, and educational supplies.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-steelGrey uppercase font-heading font-bold">Total Inventory Value</div>
            <div className="font-heading font-black text-midnight text-base">{formatCurrency(totalValuation)}</div>
          </div>

          {userRole === 'ADMIN' && (
            <button
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Equipment</span>
            </button>
          )}
        </div>
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

      {/* Filters */}
      <div className="bg-pureWhite p-4 rounded-xl border border-steelGrey/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-steelGrey absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by equipment name or location..."
            className="w-full pl-9 pr-3 py-2 bg-warmIvory/60 border border-slate-200 rounded-lg text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-warmIvory/60 border border-slate-200 rounded-lg text-xs font-medium text-charcoal py-2 px-3 focus:outline-none focus:ring-1 focus:ring-antiqueGold"
          >
            <option value="ALL">All Asset Categories</option>
            <option value="LAB_EQUIPMENT">Science Lab Apparatus</option>
            <option value="IT_HARDWARE">Robotics & IT Hardware</option>
            <option value="SPORTS">Athletics & Sports Gear</option>
            <option value="STATIONERY">Classroom Stationery</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-pureWhite rounded-xl border border-steelGrey/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal">
            <thead className="bg-warmIvory/80 text-midnight uppercase font-heading font-extrabold text-[11px] border-b border-steelGrey/20">
              <tr>
                <th className="py-3 px-4">Equipment Description</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Stored Location</th>
                <th className="py-3 px-4">Stock In-Hand</th>
                <th className="py-3 px-4">Unit Valuation</th>
                <th className="py-3 px-4">Total Value</th>
                <th className="py-3 px-4 text-right">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-warmIvory/40 transition">
                  <td className="py-3 px-4 font-heading font-bold text-midnight">
                    {item.itemName}
                  </td>
                  <td className="py-3 px-4 font-semibold text-charcoal">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-slate-100 font-mono">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-steelGrey flex items-center gap-1.5 pt-3.5">
                    <MapPin className="w-3.5 h-3.5 text-antiqueGold" />
                    <span>{item.location || 'Central Depot'}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-midnight">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="py-3 px-4 font-mono text-steelGrey">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-midnight">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase ${
                        item.quantity > 5
                          ? 'bg-deepEmerald/15 text-deepEmerald border border-deepEmerald/30'
                          : 'bg-mutedRed/15 text-mutedRed border border-mutedRed/30'
                      }`}
                    >
                      {item.quantity > 5 ? 'IN STOCK' : 'LOW STOCK'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-pureWhite rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-heading font-bold text-midnight uppercase tracking-wider">
                Register Equipment Asset
              </h2>
              <button onClick={() => setAddModalOpen(false)} className="text-steelGrey hover:text-midnight">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4 text-xs font-sans">
              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Item Name & Model
                </label>
                <input
                  type="text"
                  name="itemName"
                  required
                  placeholder="e.g. Digital Spectrophotometer 5000"
                  className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                  >
                    <option value="LAB_EQUIPMENT">Science Lab Apparatus</option>
                    <option value="IT_HARDWARE">Robotics & IT Hardware</option>
                    <option value="SPORTS">Athletics & Sports Gear</option>
                    <option value="STATIONERY">Classroom Stationery</option>
                  </select>
                </div>

                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                    Storage Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Science Lab 2, Cupboard B"
                    className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                    Initial Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    defaultValue="10"
                    required
                    className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                  />
                </div>

                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                    Unit Type
                  </label>
                  <input
                    type="text"
                    name="unit"
                    defaultValue="Units"
                    className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                  />
                </div>

                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                    Unit Cost
                  </label>
                  <input
                    type="number"
                    name="unitPrice"
                    defaultValue="1500"
                    required
                    className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-charcoal font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider shadow-sm transition"
                >
                  {loading ? 'Adding...' : 'Register Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
