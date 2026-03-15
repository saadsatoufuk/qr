'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, X } from 'lucide-react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { ADMIN_TEXT } from '@/lib/adminText';
import toast from 'react-hot-toast';

const FOOD_EMOJIS = ['🍽️','🥗','🍖','🍕','🍝','🍜','🍣','🍤','🍔','🌮','🥘','🍲','🍱','🥙','🍮','🧁','🍰','🍦','☕','🍵','🥤','🍷','🍺','🫖','🥞','🧀','🍞','🥐','🥩','🐟','🦐','🥑','🌶️','🫒','🍋'];

const BADGE_OPTIONS = [
  { value: '',            label: ADMIN_TEXT.menu.badgeNone },
  { value: 'new',         label: ADMIN_TEXT.menu.badgeNew },
  { value: 'popular',     label: ADMIN_TEXT.menu.badgePopular },
  { value: 'chef_special', label: ADMIN_TEXT.menu.badgeChefSpecial },
  { value: 'offer',       label: ADMIN_TEXT.menu.badgeOffer },
  { value: 'sold_out',    label: ADMIN_TEXT.menu.badgeSoldOut },
];

const ALLERGEN_OPTIONS = [
  { value: 'nuts',    label: ADMIN_TEXT.menu.allergenNuts },
  { value: 'dairy',   label: ADMIN_TEXT.menu.allergenDairy },
  { value: 'gluten',  label: ADMIN_TEXT.menu.allergenGluten },
  { value: 'seafood', label: ADMIN_TEXT.menu.allergenSeafood },
  { value: 'eggs',    label: ADMIN_TEXT.menu.allergenEggs },
  { value: 'soy',     label: ADMIN_TEXT.menu.allergenSoy },
];

export default function MenuPage() {
  const [tab, setTab] = useState<'categories' | 'items'>('categories');
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [catModal, setCatModal] = useState(false);
  const [editCat, setEditCat] = useState<any>(null);
  const [catForm, setCatForm] = useState({ name: '', nameAr: '', emoji: '🍽️', sortOrder: 0, isVisible: true });

  const [itemPanel, setItemPanel] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [itemForm, setItemForm] = useState({
    name: '', nameAr: '', description: '', descriptionAr: '', categoryId: '',
    price: '', offerPrice: '', image: '', badge: '', isAvailable: true,
    calories: '', preparationMinutes: '', allergens: [] as string[], sortOrder: 0,
  });
  const [showOfferPrice, setShowOfferPrice] = useState(false);
  const [catFilter, setCatFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [catRes, itemRes] = await Promise.all([fetch('/api/categories'), fetch('/api/items')]);
      const catData = await catRes.json();
      const itemData = await itemRes.json();
      setCategories(catData.categories || []);
      setItems(itemData.items || []);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCatModal = (cat?: any) => {
    if (cat) {
      setEditCat(cat);
      setCatForm({ name: cat.name, nameAr: cat.nameAr || '', emoji: cat.emoji, sortOrder: cat.sortOrder, isVisible: cat.isVisible });
    } else {
      setEditCat(null);
      setCatForm({ name: '', nameAr: '', emoji: '🍽️', sortOrder: categories.length, isVisible: true });
    }
    setCatModal(true);
  };

  const saveCat = async () => {
    try {
      const url = editCat ? `/api/categories/${editCat._id}` : '/api/categories';
      const method = editCat ? 'PATCH' : 'POST';
      await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(catForm) });
      toast.success(editCat ? ADMIN_TEXT.feedback.updatedSuccessfully : ADMIN_TEXT.feedback.addedSuccessfully);
      setCatModal(false);
      fetchData();
    } catch { toast.error(ADMIN_TEXT.feedback.errorOccurred); }
  };

  const openItemPanel = (item?: any) => {
    if (item) {
      setEditItem(item);
      setItemForm({
        name: item.name, nameAr: item.nameAr || '', description: item.description || '',
        descriptionAr: item.descriptionAr || '', categoryId: item.categoryId,
        price: String(item.price), offerPrice: item.offerPrice ? String(item.offerPrice) : '',
        image: item.image || '', badge: item.badge || '', isAvailable: item.isAvailable,
        calories: item.calories ? String(item.calories) : '',
        preparationMinutes: item.preparationMinutes ? String(item.preparationMinutes) : '',
        allergens: item.allergens || [], sortOrder: item.sortOrder,
      });
      setShowOfferPrice(!!item.offerPrice);
    } else {
      setEditItem(null);
      setItemForm({
        name: '', nameAr: '', description: '', descriptionAr: '', categoryId: categories[0]?._id || '',
        price: '', offerPrice: '', image: '', badge: '', isAvailable: true,
        calories: '', preparationMinutes: '', allergens: [], sortOrder: items.length,
      });
      setShowOfferPrice(false);
    }
    setItemPanel(true);
  };

  const saveItem = async () => {
    try {
      const payload = {
        ...itemForm,
        price: parseFloat(itemForm.price) || 0,
        offerPrice: showOfferPrice && itemForm.offerPrice ? parseFloat(itemForm.offerPrice) : null,
        badge: itemForm.badge || null,
        calories: itemForm.calories ? parseInt(itemForm.calories) : null,
        preparationMinutes: itemForm.preparationMinutes ? parseInt(itemForm.preparationMinutes) : null,
      };
      const url = editItem ? `/api/items/${editItem._id}` : '/api/items';
      const method = editItem ? 'PATCH' : 'POST';
      await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      toast.success(editItem ? ADMIN_TEXT.feedback.updatedSuccessfully : ADMIN_TEXT.feedback.addedSuccessfully);
      setItemPanel(false);
      fetchData();
    } catch { toast.error(ADMIN_TEXT.feedback.errorOccurred); }
  };

  const deleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/${deleteTarget.type}/${deleteTarget.id}`, { method: 'DELETE' });
      toast.success(ADMIN_TEXT.feedback.deletedSuccessfully);
      setDeleteTarget(null);
      fetchData();
    } catch { toast.error(ADMIN_TEXT.feedback.errorOccurred); }
  };

  const toggleAvailable = async (itemId: string, available: boolean) => {
    await fetch(`/api/items/${itemId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isAvailable: available }) });
    fetchData();
  };

  const toggleVisible = async (catId: string, visible: boolean) => {
    await fetch(`/api/categories/${catId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isVisible: visible }) });
    fetchData();
  };

  const filteredItems = items.filter((item) => {
    if (catFilter && item.categoryId !== catFilter) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton-admin h-16 rounded-xl" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">{ADMIN_TEXT.menu.title}</h1>
        <button onClick={() => tab === 'categories' ? openCatModal() : openItemPanel()}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
          <Plus size={16} /> {tab === 'categories' ? ADMIN_TEXT.menu.addCategory : ADMIN_TEXT.menu.addItem}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-admin-surface rounded-lg p-1 w-fit">
        <button onClick={() => setTab('categories')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'categories' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>
          {ADMIN_TEXT.menu.categoriesTab}
        </button>
        <button onClick={() => setTab('items')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'items' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>
          {ADMIN_TEXT.menu.itemsTab}
        </button>
      </div>

      {/* Categories Table */}
      {tab === 'categories' && (
        <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-admin-border">
                <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium">{ADMIN_TEXT.menu.colEmoji}</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium">{ADMIN_TEXT.menu.colCategoryName}</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium hidden sm:table-cell">{ADMIN_TEXT.menu.categoryNameAr}</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium">{ADMIN_TEXT.menu.colItemCount}</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium">{ADMIN_TEXT.menu.colVisible}</th>
                <th className="text-right px-4 py-3 text-gray-500 text-xs font-medium">{ADMIN_TEXT.menu.colActions}</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={cat._id} className={`border-b border-admin-border/50 ${i % 2 === 1 ? 'bg-admin-row' : ''}`}>
                  <td className="px-4 py-3 text-lg">{cat.emoji}</td>
                  <td className="px-4 py-3 text-white text-sm">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm hidden sm:table-cell" dir="auto">{cat.nameAr || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{items.filter(it => it.categoryId === cat._id).length}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleVisible(cat._id, !cat.isVisible)}
                      className={`p-1 rounded ${cat.isVisible ? 'text-admin-green' : 'text-gray-600'}`}>
                      {cat.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openCatModal(cat)} className="p-1.5 rounded hover:bg-white/[0.06] text-gray-400 hover:text-white"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteTarget({ type: 'categories', id: cat._id })} className="p-1.5 rounded hover:bg-red-500/10 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500 text-sm">{ADMIN_TEXT.menu.noCategoriesYet}<br/><span className="text-gray-600">{ADMIN_TEXT.menu.noCategoriesSub}</span></td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Items */}
      {tab === 'items' && (
        <>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-admin-bg border border-admin-border rounded-lg pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-gray-600" placeholder={ADMIN_TEXT.menu.searchItems} />
            </div>
            <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
              className="bg-admin-bg border border-admin-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
              <option value="">{ADMIN_TEXT.menu.allCategories}</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.emoji} {c.name}</option>)}
            </select>
          </div>
          <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-admin-border">
                  <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium">{ADMIN_TEXT.menu.itemImage}</th>
                  <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium">{ADMIN_TEXT.menu.colItemName}</th>
                  <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium hidden md:table-cell">{ADMIN_TEXT.menu.colCategory}</th>
                  <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium">{ADMIN_TEXT.menu.colPrice}</th>
                  <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium hidden sm:table-cell">{ADMIN_TEXT.menu.colBadge}</th>
                  <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium">{ADMIN_TEXT.menu.colAvailable}</th>
                  <th className="text-right px-4 py-3 text-gray-500 text-xs font-medium">{ADMIN_TEXT.menu.colActions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, i) => {
                  const cat = categories.find(c => c._id === item.categoryId);
                  return (
                    <tr key={item._id} className={`border-b border-admin-border/50 ${i % 2 === 1 ? 'bg-admin-row' : ''}`}>
                      <td className="px-4 py-2">
                        {item.image ? <img src={item.image} className="w-10 h-10 rounded-lg object-cover" alt="" /> : <div className="w-10 h-10 rounded-lg bg-admin-bg" />}
                      </td>
                      <td className="px-4 py-3 text-white text-sm">{item.name}</td>
                      <td className="px-4 py-3 text-gray-500 text-sm hidden md:table-cell">{cat ? `${cat.emoji} ${cat.name}` : '—'}</td>
                      <td className="px-4 py-3 text-admin-gold text-sm font-medium">{item.price}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {item.badge && <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-300">
                          {BADGE_OPTIONS.find(b => b.value === item.badge)?.label || item.badge}
                        </span>}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleAvailable(item._id, !item.isAvailable)}
                          className={`p-1 rounded ${item.isAvailable ? 'text-admin-green' : 'text-gray-600'}`}>
                          {item.isAvailable ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openItemPanel(item)} className="p-1.5 rounded hover:bg-white/[0.06] text-gray-400 hover:text-white"><Pencil size={14} /></button>
                          <button onClick={() => setDeleteTarget({ type: 'items', id: item._id })} className="p-1.5 rounded hover:bg-red-500/10 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredItems.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-500 text-sm">{searchQuery || catFilter ? ADMIN_TEXT.menu.noItemsInFilter : ADMIN_TEXT.menu.noItemsYet}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Category Modal */}
      {catModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCatModal(false)} />
          <div className="relative bg-admin-card border border-admin-border rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">{editCat ? ADMIN_TEXT.menu.editCategory : ADMIN_TEXT.menu.addCategory}</h3>
              <button onClick={() => setCatModal(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.menu.categoryName} *</label>
                <input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} dir="auto"
                  className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600" placeholder={ADMIN_TEXT.menu.categoryNamePh} />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.menu.categoryNameAr}</label>
                <input value={catForm.nameAr} onChange={(e) => setCatForm({ ...catForm, nameAr: e.target.value })} dir="auto"
                  className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600" placeholder={ADMIN_TEXT.menu.categoryNameArPh} />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.menu.categoryEmoji}</label>
                <div className="flex flex-wrap gap-2">
                  {FOOD_EMOJIS.map(e => (
                    <button key={e} onClick={() => setCatForm({ ...catForm, emoji: e })}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${catForm.emoji === e ? 'bg-white/10 ring-1 ring-white/30' : 'hover:bg-white/[0.06]'}`}>{e}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.menu.itemSortOrder}</label>
                <input type="number" value={catForm.sortOrder} onChange={(e) => setCatForm({ ...catForm, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={catForm.isVisible} onChange={(e) => setCatForm({ ...catForm, isVisible: e.target.checked })} className="sr-only" />
                <div className={`w-10 h-6 rounded-full relative transition-colors ${catForm.isVisible ? 'bg-admin-green' : 'bg-gray-700'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${catForm.isVisible ? 'left-5' : 'left-1'}`} />
                </div>
                <span className="text-gray-400 text-sm">{ADMIN_TEXT.menu.categoryVisible}</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setCatModal(false)} className="px-4 py-2 rounded-lg text-sm text-gray-400 border border-admin-border hover:border-gray-600">{ADMIN_TEXT.actions.cancel}</button>
              <button onClick={saveCat} className="px-6 py-2 rounded-lg text-sm font-medium bg-white text-black hover:bg-gray-200">{ADMIN_TEXT.actions.save}</button>
            </div>
          </div>
        </div>
      )}

      {/* Item Panel (Slide-in) */}
      {itemPanel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setItemPanel(false)} />
          <div className="relative bg-admin-card border-l border-admin-border w-full max-w-lg h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-admin-card border-b border-admin-border px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-white font-semibold text-lg">{editItem ? ADMIN_TEXT.menu.editItem : ADMIN_TEXT.menu.addItem}</h3>
              <button onClick={() => setItemPanel(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.menu.itemName} *</label>
                  <input value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} dir="auto"
                    className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600" placeholder={ADMIN_TEXT.menu.itemNamePh} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.menu.itemNameAr}</label>
                  <input value={itemForm.nameAr} onChange={(e) => setItemForm({ ...itemForm, nameAr: e.target.value })} dir="auto"
                    className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600" placeholder={ADMIN_TEXT.menu.itemNameArPh} />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.menu.itemDescription}</label>
                <textarea value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} rows={2} dir="auto"
                  className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600 resize-none" placeholder={ADMIN_TEXT.menu.itemDescriptionPh} />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.menu.itemDescriptionAr}</label>
                <textarea value={itemForm.descriptionAr} onChange={(e) => setItemForm({ ...itemForm, descriptionAr: e.target.value })} rows={2} dir="auto"
                  className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600 resize-none" placeholder={ADMIN_TEXT.menu.itemDescriptionArPh} />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.menu.itemCategory} *</label>
                <select value={itemForm.categoryId} onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })}
                  className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none">
                  <option value="">{ADMIN_TEXT.menu.selectCategory}</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.emoji} {c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.menu.itemPrice} *</label>
                  <input type="number" step="0.01" value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                    className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600" placeholder={ADMIN_TEXT.menu.itemPricePh} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 flex items-center gap-2">
                    {ADMIN_TEXT.menu.itemOfferPrice}
                    <button onClick={() => setShowOfferPrice(!showOfferPrice)} className="text-xs text-admin-gold">{showOfferPrice ? ADMIN_TEXT.actions.close : ADMIN_TEXT.actions.add}</button>
                  </label>
                  {showOfferPrice && (
                    <input type="number" step="0.01" value={itemForm.offerPrice} onChange={(e) => setItemForm({ ...itemForm, offerPrice: e.target.value })}
                      className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600" placeholder={ADMIN_TEXT.menu.itemOfferPricePh} />
                  )}
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.menu.itemImage}</label>
                <input value={itemForm.image} onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                  className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600" placeholder={ADMIN_TEXT.menu.itemImagePh} />
                {itemForm.image && <img src={itemForm.image} alt="Preview" className="w-20 h-20 rounded-lg object-cover mt-2 border border-admin-border" />}
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.menu.itemBadge}</label>
                <div className="flex flex-wrap gap-2">
                  {BADGE_OPTIONS.map(b => (
                    <button key={b.value} onClick={() => setItemForm({ ...itemForm, badge: b.value })}
                      className={`px-3 py-1.5 rounded-lg text-xs ${itemForm.badge === b.value ? 'bg-white text-black' : 'bg-admin-bg border border-admin-border text-gray-400 hover:text-white'}`}>
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.menu.itemCalories}</label>
                  <input type="number" value={itemForm.calories} onChange={(e) => setItemForm({ ...itemForm, calories: e.target.value })}
                    className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600" placeholder={ADMIN_TEXT.menu.itemCaloriesPh} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.menu.itemPrepTime}</label>
                  <input type="number" value={itemForm.preparationMinutes} onChange={(e) => setItemForm({ ...itemForm, preparationMinutes: e.target.value })}
                    className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600" placeholder={ADMIN_TEXT.menu.itemPrepTimePh} />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.menu.itemAllergens}</label>
                <div className="flex flex-wrap gap-2">
                  {ALLERGEN_OPTIONS.map(a => (
                    <button key={a.value} onClick={() => {
                      const arr = itemForm.allergens.includes(a.value) ? itemForm.allergens.filter(x => x !== a.value) : [...itemForm.allergens, a.value];
                      setItemForm({ ...itemForm, allergens: arr });
                    }} className={`px-3 py-1.5 rounded-lg text-xs ${itemForm.allergens.includes(a.value) ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-admin-bg border border-admin-border text-gray-400'}`}>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={itemForm.isAvailable} onChange={(e) => setItemForm({ ...itemForm, isAvailable: e.target.checked })} className="sr-only" />
                <div className={`w-10 h-6 rounded-full relative transition-colors ${itemForm.isAvailable ? 'bg-admin-green' : 'bg-gray-700'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${itemForm.isAvailable ? 'left-5' : 'left-1'}`} />
                </div>
                <span className="text-gray-400 text-sm">{ADMIN_TEXT.menu.itemAvailable}</span>
              </label>
            </div>
            <div className="sticky bottom-0 bg-admin-card border-t border-admin-border px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setItemPanel(false)} className="px-4 py-2 rounded-lg text-sm text-gray-400 border border-admin-border hover:border-gray-600">{ADMIN_TEXT.actions.cancel}</button>
              <button onClick={saveItem} className="px-6 py-2 rounded-lg text-sm font-medium bg-white text-black hover:bg-gray-200">{ADMIN_TEXT.actions.save}</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.type === 'categories' ? ADMIN_TEXT.menu.deleteCategoryConfirm : ADMIN_TEXT.menu.deleteItemConfirm}
        message={ADMIN_TEXT.confirmModal.defaultMessage}
        confirmLabel={ADMIN_TEXT.actions.delete}
        confirmVariant="danger"
        onConfirm={deleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
