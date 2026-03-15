export const ADMIN_TEXT = {

  // ─── NAVIGATION ───
  nav: {
    dashboard:    'لوحة التحكم',
    menu:         'إدارة القائمة',
    orders:       'سجل الطلبات',
    tables:       'الطاولات',
    settings:     'الإعدادات',
    logout:       'تسجيل الخروج',
    viewMenu:     'عرض القائمة',
  },

  // ─── COMMON ACTIONS ───
  actions: {
    save:         'حفظ',
    saving:       'جارٍ الحفظ...',
    cancel:       'إلغاء',
    delete:       'حذف',
    edit:         'تعديل',
    add:          'إضافة',
    confirm:      'تأكيد',
    close:        'إغلاق',
    back:         'رجوع',
    next:         'التالي',
    search:       'بحث',
    filter:       'تصفية',
    export:       'تصدير',
    download:     'تحميل',
  },

  // ─── FEEDBACK ───
  feedback: {
    savedSuccessfully:  'تم الحفظ بنجاح',
    deletedSuccessfully:'تم الحذف بنجاح',
    addedSuccessfully:  'تمت الإضافة بنجاح',
    updatedSuccessfully:'تم التحديث بنجاح',
    errorOccurred:      'حدث خطأ، يرجى المحاولة مجدداً',
    loading:            'جارٍ التحميل...',
    noResults:          'لا توجد نتائج',
  },

  // ─── LOGIN ───
  login: {
    title:            'تسجيل الدخول',
    subtitle:         'لوحة تحكم المطعم',
    emailLabel:       'البريد الإلكتروني',
    emailPlaceholder: 'أدخل بريدك الإلكتروني',
    passwordLabel:    'كلمة المرور',
    passwordPlaceholder: 'أدخل كلمة المرور',
    submitButton:     'دخول',
    submitting:       'جارٍ التحقق...',
    invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  },

  // ─── SETUP WIZARD ───
  setup: {
    step1Title:       'معلومات المطعم',
    step1Subtitle:    'أدخل البيانات الأساسية لمطعمك',
    restaurantName:   'اسم المطعم',
    restaurantNamePh: 'مثال: مطعم نور',
    slug:             'الرابط المخصص',
    slugPh:           'مثال: nour-restaurant',
    description:      'وصف المطعم',
    descriptionPh:    'اكتب وصفاً مختصراً عن مطعمك',
    address:          'العنوان',
    addressPh:        'عنوان المطعم',
    currency:         'العملة',

    step2Title:       'بيانات الدخول',
    step2Subtitle:    'ستستخدم هذه البيانات لتسجيل الدخول',
    adminEmail:       'البريد الإلكتروني للمدير',
    adminEmailPh:     'admin@restaurant.com',
    adminPassword:    'كلمة المرور',
    adminPasswordPh:  'على الأقل 6 أحرف',
    confirmPassword:  'تأكيد كلمة المرور',
    confirmPasswordPh:'أعد إدخال كلمة المرور',
    passwordMismatch: 'كلمتا المرور غير متطابقتين',

    step3Title:       'الهوية البصرية',
    step3Subtitle:    'خصّص مظهر قائمتك',
    primaryColor:     'اللون الرئيسي',
    logoUrl:          'رابط الشعار',
    logoUrlPh:        'https://...',
    coverImageUrl:    'رابط صورة الغلاف',
    coverImageUrlPh:  'https://...',

    finishButton:     'إنشاء الحساب',
    finishing:        'جارٍ إنشاء الحساب...',
    nameRequired:     'الاسم والرابط مطلوبان',
    emailRequired:    'البريد الإلكتروني وكلمة المرور مطلوبان',
  },

  // ─── DASHBOARD ───
  dashboard: {
    title:          'لوحة التحكم',
    liveOrders:     'الطلبات الحالية',
    noOrders:       'لا توجد طلبات',

    todayOrders:    'طلبات اليوم',
    todayRevenue:   'إيرادات اليوم',
    activeTables:   'طاولات نشطة',
    avgOrderValue:  'متوسط الطلب',

    confirmOrder:   'تأكيد الطلب',
    startPreparing: 'بدء التحضير',
    markReady:      'الطلب جاهز',
    markCompleted:  'تم الاستلام ✓',
    cancelOrder:    'إلغاء الطلب',

    guest:          'زبون',
    cash:           'كاش',
    card:           'بطاقة',
    readyForPickup: 'جاهز للاستلام',

    cancelTitle:    'إلغاء الطلب',
    cancelMessage:  'هل أنت متأكد من إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.',

    notifications:      'الإشعارات',
    markAllRead:        'تعيين الكل كمقروء',
    noNotifications:    'لا توجد إشعارات',
    newOrderToast:      (table: string) => `طلب جديد — طاولة ${table}`,
    failedUpdate:       'فشل في تحديث الطلب',
  },

  // ─── ORDER STATUS ───
  orderStatus: {
    pending:   'معلق',
    confirmed: 'مؤكد',
    preparing: 'قيد التحضير',
    ready:     'جاهز',
    completed: 'مكتمل',
    cancelled: 'ملغي',
  } as Record<string, string>,

  // ─── MENU MANAGEMENT ───
  menu: {
    title:              'إدارة القائمة',
    categoriesTab:      'الأقسام',
    itemsTab:           'الأصناف',

    addCategory:        'إضافة قسم',
    editCategory:       'تعديل القسم',
    categoryName:       'اسم القسم',
    categoryNamePh:     'مثال: المقبلات',
    categoryNameAr:     'الاسم بالعربية',
    categoryNameArPh:   'مثال: مقبلات',
    categoryEmoji:      'الرمز',
    categoryVisible:    'ظاهر في القائمة',
    noCategoriesYet:    'لا توجد أقسام بعد',
    noCategoriesSub:    'أضف قسماً لتبدأ في بناء قائمتك',
    deleteCategoryConfirm: 'هل تريد حذف هذا القسم؟',

    colCategoryName:    'اسم القسم',
    colEmoji:           'الرمز',
    colItemCount:       'عدد الأصناف',
    colVisible:         'الظهور',
    colActions:         'إجراءات',

    addItem:            'إضافة صنف',
    editItem:           'تعديل الصنف',
    allCategories:      'كل الأقسام',
    searchItems:        'ابحث عن صنف...',
    noItemsYet:         'لا توجد أصناف بعد',
    noItemsSub:         'أضف أول صنف لمطعمك',
    noItemsInFilter:    'لا توجد أصناف تطابق الفلتر',

    itemName:           'اسم الصنف',
    itemNamePh:         'مثال: شاورما دجاج',
    itemNameAr:         'الاسم بالعربية',
    itemNameArPh:       'مثال: شاورما دجاج',
    itemDescription:    'الوصف',
    itemDescriptionPh:  'وصف مختصر للصنف',
    itemDescriptionAr:  'الوصف بالعربية',
    itemDescriptionArPh:'وصف مختصر بالعربية',
    itemCategory:       'القسم',
    selectCategory:     'اختر القسم',
    itemPrice:          'السعر',
    itemPricePh:        '0.00',
    itemOfferPrice:     'سعر العرض',
    itemOfferPricePh:   '0.00',
    itemImage:          'رابط الصورة',
    itemImagePh:        'https://...',
    itemBadge:          'الشارة',
    itemAvailable:      'متاح للطلب',
    itemCalories:       'السعرات الحرارية',
    itemCaloriesPh:     'مثال: 450',
    itemPrepTime:       'وقت التحضير (دقيقة)',
    itemPrepTimePh:     'مثال: 15',
    itemAllergens:      'مسببات الحساسية',
    itemSortOrder:      'ترتيب العرض',
    itemSortOrderPh:    'رقم أصغر = يظهر أولاً',

    badgeNone:          'بدون شارة',
    badgeNew:           'جديد',
    badgePopular:       'الأكثر طلباً',
    badgeChefSpecial:   'اختيار الشيف',
    badgeOffer:         'عرض',
    badgeSoldOut:       'نفذ',

    allergenNuts:       'مكسرات',
    allergenDairy:      'منتجات ألبان',
    allergenGluten:     'جلوتين',
    allergenSeafood:    'مأكولات بحرية',
    allergenEggs:       'بيض',
    allergenSoy:        'صويا',

    colItemName:        'الصنف',
    colCategory:        'القسم',
    colPrice:           'السعر',
    colBadge:           'الشارة',
    colAvailable:       'متاح',

    deleteItemConfirm:  'هل تريد حذف هذا الصنف؟',
  },

  // ─── ORDERS HISTORY ───
  orders: {
    title:            'سجل الطلبات',
    filterStatus:     'الحالة',
    filterSearch:     'بحث برقم الطلب...',
    allStatuses:      'كل الحالات',
    exportCsv:        'تصدير CSV',

    colOrderNumber:   'رقم الطلب',
    colTable:         'الطاولة',
    colCustomer:      'العميل',
    colItems:         'الأصناف',
    colTotal:         'المجموع',
    colPayment:       'الدفع',
    colStatus:        'الحالة',
    colDate:          'التاريخ',
    colActions:       'إجراءات',

    cash:             'كاش',
    card:             'بطاقة',

    noOrders:         'لا توجد طلبات',
    noOrdersSub:      'لم يتم استلام أي طلبات حتى الآن',
    noOrdersFiltered: 'لا توجد طلبات تطابق الفلتر المحدد',

    orderDetail:      'تفاصيل الطلب',
    orderItems:       'الأصناف المطلوبة',
    orderNotes:       'ملاحظات الطلب',
    noNotes:          'لا توجد ملاحظات',
    placedAt:         'وقت الطلب',
    subtotal:         'المجموع',

    page:             'صفحة',
    of:               'من',
  },

  // ─── TABLE MANAGEMENT ───
  tables: {
    title:              'إدارة الطاولات',
    subtitle:           'أنشئ رمز QR لكل طاولة',
    addTable:           'إضافة طاولة',
    editTable:          'تعديل الطاولة',
    noTablesYet:        'لا توجد طاولات بعد',
    noTablesSub:        'أضف طاولة لتوليد رمز QR خاص بها',
    downloadAllQr:      'تحميل كل رموز QR',
    downloadingZip:     'جارٍ التحضير...',

    tableNumber:        'رقم الطاولة',
    tableNumberPh:      'مثال: T1',
    tableLabel:         'الوصف',
    tableLabelPh:       'مثال: طاولة النافذة',
    tableCapacity:      'عدد المقاعد',
    tableCapacityPh:    '4',
    tableActive:        'نشطة',

    seats:              'مقاعد',
    downloadQr:         'تحميل QR',
    deleteTableConfirm: 'هل تريد حذف هذه الطاولة؟',
  },

  // ─── SETTINGS ───
  settings: {
    title:              'الإعدادات',

    sectionGeneral:     'المعلومات العامة',
    restaurantName:     'اسم المطعم',
    slugLabel:          'الرابط المخصص',
    description:        'الوصف',
    address:            'العنوان',

    sectionBranding:    'الهوية البصرية',
    logoUrl:            'رابط الشعار',
    coverImageUrl:      'رابط صورة الغلاف',
    primaryColor:       'اللون الرئيسي',

    sectionOperations:  'إعدادات التشغيل',
    isOpen:             'المطعم مفتوح',
    isOpenHint:         'عند الإيقاف ستظهر رسالة "مغلق" للعملاء',
    currency:           'العملة',
    estimatedWait:      'وقت الانتظار المتوقع (دقيقة)',
    estimatedWaitHint:  'يظهر للعميل بعد إتمام الطلب',

    saveSettings:       'حفظ الإعدادات',
    settingsSaved:      'تم حفظ الإعدادات بنجاح',
  },

  // ─── CONFIRM MODAL ───
  confirmModal: {
    defaultTitle:   'تأكيد الإجراء',
    defaultMessage: 'هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.',
    confirm:        'تأكيد',
    cancel:         'إلغاء',
  },

} as const;
