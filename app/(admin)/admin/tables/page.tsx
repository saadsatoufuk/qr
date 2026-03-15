'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Download, Trash2, Pencil, Users, QrCode, X } from 'lucide-react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { ADMIN_TEXT } from '@/lib/adminText';
import toast from 'react-hot-toast';

export default function TablesPage() {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editTable, setEditTable] = useState<any>(null);
  const [form, setForm] = useState({ tableNumber: '', label: '', capacity: '4' });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchTables = useCallback(async () => {
    try {
      const res = await fetch('/api/tables');
      const data = await res.json();
      setTables(data.tables || []);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTables(); }, [fetchTables]);

  const openModal = (table?: any) => {
    if (table) {
      setEditTable(table);
      setForm({ tableNumber: table.tableNumber, label: table.label || '', capacity: String(table.capacity) });
    } else {
      setEditTable(null);
      setForm({ tableNumber: '', label: '', capacity: '4' });
    }
    setModal(true);
  };

  const saveTable = async () => {
    try {
      const payload = { ...form, capacity: parseInt(form.capacity) || 4 };
      const url = editTable ? `/api/tables/${editTable._id}` : '/api/tables';
      const method = editTable ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const data = await res.json(); toast.error(data.error || ADMIN_TEXT.feedback.errorOccurred); return; }
      toast.success(editTable ? ADMIN_TEXT.feedback.updatedSuccessfully : ADMIN_TEXT.feedback.addedSuccessfully);
      setModal(false);
      fetchTables();
    } catch { toast.error(ADMIN_TEXT.feedback.errorOccurred); }
  };

  const deleteTable = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/tables/${deleteId}`, { method: 'DELETE' });
      toast.success(ADMIN_TEXT.feedback.deletedSuccessfully);
      setDeleteId(null);
      fetchTables();
    } catch { toast.error(ADMIN_TEXT.feedback.errorOccurred); }
  };

  const downloadQR = (table: any) => {
    const link = document.createElement('a');
    link.download = `Table-${table.tableNumber}-QR.png`;
    link.href = table.qrCodeDataUrl;
    link.click();
  };

  const downloadAllQR = async () => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    tables.forEach((table) => {
      if (table.qrCodeDataUrl) {
        const data = table.qrCodeDataUrl.split(',')[1];
        zip.file(`Table-${table.tableNumber}-QR.png`, data, { base64: true });
      }
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'QR-Codes.zip';
    link.click();
  };

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="skeleton-admin h-64 rounded-xl" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">{ADMIN_TEXT.tables.title}</h1>
          <p className="text-gray-500 text-sm mt-1">{ADMIN_TEXT.tables.subtitle}</p>
        </div>
        <div className="flex gap-3">
          {tables.length > 0 && (
            <button onClick={downloadAllQR}
              className="flex items-center gap-2 px-4 py-2 border border-admin-border rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
              <Download size={16} /> {ADMIN_TEXT.tables.downloadAllQr}
            </button>
          )}
          <button onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            <Plus size={16} /> {ADMIN_TEXT.tables.addTable}
          </button>
        </div>
      </div>

      {tables.length === 0 ? (
        <div className="text-center py-16">
          <QrCode size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">{ADMIN_TEXT.tables.noTablesYet}</p>
          <p className="text-gray-600 text-sm">{ADMIN_TEXT.tables.noTablesSub}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <div key={table._id} className="bg-admin-card border border-admin-border rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold text-xl font-cormorant">{table.tableNumber}</h3>
                  {table.label && <p className="text-gray-500 text-sm mt-0.5">{table.label}</p>}
                  <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                    <Users size={12} /> {table.capacity} {ADMIN_TEXT.tables.seats}
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${table.isActive ? 'bg-admin-green' : 'bg-gray-600'}`} />
              </div>

              {table.qrCodeDataUrl && (
                <div className="bg-white rounded-lg p-3 mb-4 flex items-center justify-center">
                  <img src={table.qrCodeDataUrl} alt={`QR for ${table.tableNumber}`} className="w-[120px] h-[120px]" />
                </div>
              )}

              <p className="text-gray-600 text-xs mb-4 truncate break-all">{table.qrTargetUrl}</p>

              <div className="flex gap-2">
                <button onClick={() => downloadQR(table)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/[0.06] rounded-lg text-sm text-white hover:bg-white/[0.1] transition-colors">
                  <Download size={14} /> {ADMIN_TEXT.tables.downloadQr}
                </button>
                <button onClick={() => openModal(table)} className="p-2 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-white"><Pencil size={14} /></button>
                <button onClick={() => setDeleteId(table._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Table Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative bg-admin-card border border-admin-border rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">{editTable ? ADMIN_TEXT.tables.editTable : ADMIN_TEXT.tables.addTable}</h3>
              <button onClick={() => setModal(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.tables.tableNumber} *</label>
                <input value={form.tableNumber} onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
                  className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600" placeholder={ADMIN_TEXT.tables.tableNumberPh} />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.tables.tableLabel}</label>
                <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} dir="auto"
                  className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600" placeholder={ADMIN_TEXT.tables.tableLabelPh} />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.tables.tableCapacity}</label>
                <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600" placeholder={ADMIN_TEXT.tables.tableCapacityPh} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(false)} className="px-4 py-2 rounded-lg text-sm text-gray-400 border border-admin-border hover:border-gray-600">{ADMIN_TEXT.actions.cancel}</button>
              <button onClick={saveTable} className="px-6 py-2 rounded-lg text-sm font-medium bg-white text-black hover:bg-gray-200">{ADMIN_TEXT.actions.save}</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} title={ADMIN_TEXT.tables.deleteTableConfirm} message={ADMIN_TEXT.confirmModal.defaultMessage}
        confirmLabel={ADMIN_TEXT.actions.delete} confirmVariant="danger" onConfirm={deleteTable} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
