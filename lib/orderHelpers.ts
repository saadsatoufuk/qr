// Order helpers — Arabic labels, status maps, colors

export const nextStatus: Record<string, string> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'completed',
};

export const statusActionLabels: Record<string, string> = {
  pending: 'تأكيد الطلب',
  confirmed: 'بدء التحضير',
  preparing: 'الطلب جاهز',
};

export const statusLabels: Record<string, string> = {
  pending: 'معلق',
  confirmed: 'مؤكد',
  preparing: 'يتحضر',
  ready: 'جاهز',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

export const statusColors: Record<string, { dot: string; bg: string; text: string; border: string }> = {
  pending:   { dot: 'bg-yellow-400', bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  confirmed: { dot: 'bg-blue-400',   bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20'   },
  preparing: { dot: 'bg-orange-400', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  ready:     { dot: 'bg-green-400',  bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20'  },
  completed: { dot: 'bg-[#444]',     bg: 'bg-[#1A1A1A]',     text: 'text-[#666]',     border: 'border-[#1E1E1E]'    },
  cancelled: { dot: 'bg-red-400',    bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20'    },
};

export const allergenLabelsAr: Record<string, string> = {
  nuts: '🥜 مكسرات',
  dairy: '🥛 ألبان',
  gluten: '🌾 جلوتين',
  seafood: '🦐 مأكولات بحرية',
  eggs: '🥚 بيض',
  soy: '🫘 صويا',
};

export const UI_TEXT = {
  restaurantOpen: 'مفتوح الآن',
  restaurantClosed: 'مغلق حالياً',
  tableIndicator: 'طاولة',
  searchPlaceholder: 'ابحث في القائمة...',
  soldOut: 'نفذ',
  new: 'جديد',
  popular: '🔥 الأكثر طلباً',
  chefSpecial: '👨‍🍳 اختيار الشيف',
  offer: 'عرض',
  specialRequests: 'طلبات خاصة (اختياري)',
  addToOrder: 'أضف للطلب',
  yourOrder: 'طلبك',
  viewOrder: 'عرض الطلب',
  emptyCart: 'لم تضف أي صنف بعد',
  subtotal: 'المجموع',
  yourName: 'اسمك (اختياري)',
  orderNotes: 'ملاحظات إضافية...',
  cash: '💵 كاش',
  card: '💳 بطاقة',
  paymentMethod: 'طريقة الدفع',
  placeOrder: 'أرسل الطلب',
  sending: 'جارٍ الإرسال...',
  orderPlaced: 'تم استلام طلبك!',
  orderNumber: 'رقم الطلب',
  estimatedWait: 'وقت الانتظار المتوقع',
  trackOrder: 'تتبع طلبك',
  statusReceived: 'تم الاستلام',
  statusConfirmed: 'تم التأكيد',
  statusPreparing: 'قيد التحضير',
  statusReady: 'طلبك جاهز! 🎉',
  statusCancelled: 'تم إلغاء الطلب',
  orderReady: 'طلبك جاهز، يمكنك استلامه الآن',
  orderCancelled: 'عذراً، تم إلغاء طلبك',
  noTableError: 'يرجى مسح رمز QR على طاولتك للطلب',
  noTableSub: 'لا يمكن تقديم طلب بدون تحديد الطاولة',
  menuUnavailable: 'القائمة غير متاحة',
  minutes: 'دقيقة',
  calories: 'سعرة حرارية',
};
