// Modal Functions

// Edit Profile Function - Shows edit form in Settings modal
function editProfile() {
    showEditProfileForm();
}

// Personalization Modal
function openPersonalization(event) {
    if (event) event.preventDefault();
    const dropdown = document.getElementById('userDropdownMenu');
    if (dropdown) dropdown.classList.remove('show');
    
    const modal = document.getElementById('personalizationModal');
    if (modal) {
        modal.classList.add('show');
        loadPersonalizationSettings();
    }
}

function closePersonalizationModal() {
    const modal = document.getElementById('personalizationModal');
    if (modal) modal.classList.remove('show');
}

function loadPersonalizationSettings() {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'auto';
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    themeRadios.forEach(radio => {
        if (radio.value === savedTheme) {
            radio.checked = true;
        }
    });
    
    // Load saved language
    const savedLanguage = localStorage.getItem('language') || 'en';
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = savedLanguage;
    }
}

function changeTheme(theme) {
    localStorage.setItem('theme', theme);
    
    if (theme === 'auto') {
        // Use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    const currentLang = localStorage.getItem('language') || 'en';
    const t = translations[currentLang];
    showNotification(`${t.themeChanged} ${theme} ${t.mode}`, 'success');
}

// Translation dictionary
const translations = {
    en: {
        // Header
        home: 'Home',
        virtualTryOn: 'Virtual Try-On',
        clothingGallery: 'Clothing Gallery',
        features: 'Features',
        searchPlaceholder: 'Search...',
        
        // Hero Section
        heroTitle: 'AI Virtual Clothing Try-On',
        heroSubtitle: 'Experience the future of fashion with our cutting-edge AI technology. Try on clothes virtually before you buy!',
        tryNowBtn: 'Try Now',
        learnMoreBtn: 'Learn More',
        
        // User Dropdown
        viewProfile: 'View Profile',
        addressManagement: 'Address Management',
        myOrders: 'My Orders',
        paymentOptions: 'Payment Options',
        personalization: 'Personalization',
        settings: 'Settings',
        help: 'Help & Support',
        logout: 'Log out',
        
        // Notifications
        languageChanged: 'Language changed successfully!',
        themeChanged: 'Theme changed to',
        mode: 'mode',
        
        // Try-On Section
        virtualTryOnStudio: '👕 Virtual Try-On Studio',
        selectClothesUpload: 'Select clothes, upload your photo, and see instant results.',
        selectClothes: '👕 Select Clothes',
        uploadPhoto: '📸 Upload Photo',
        result: '👁️ Result',
        uploadYourCloth: 'Upload Your Cloth',
        generateResult: 'Generate Result',
        reset: 'Reset',
        save: 'Save',
        download: 'Download',
        share: 'Share',
        startTryOn: 'Start Try-On Now',
        
        // Gallery Section
        clothingGallery: '👕 Clothing Gallery',
        browseCollection: 'Browse our collection and select items to try on. Click "Try On" to add them to your virtual fitting room.',
        
        // How It Works
        howItWorks: 'How It Works',
        aiPoweredSystem: 'Our AI-powered system uses cutting-edge technology to deliver realistic virtual try-on experiences.',
        uploadYourPhoto: 'Upload Your Photo',
        chooseClothing: 'Choose Clothing',
        aiTryOn: 'AI Try-On',
        saveShare: 'Save & Share',
        
        // Exclusive Features
        exclusiveFeatures: '✨ Exclusive Features',
        discoverUnique: 'Discover unique features that make your shopping experience extraordinary',
        aiStyleAdvisor: '🤖 AI Style Advisor',
        virtualWardrobeMixer: '🎨 Virtual Wardrobe Mixer',
        socialSharingVoting: '👥 Social Sharing & Voting',
        getRecommendations: 'Get Recommendations',
        startMixing: 'Start Mixing',
        viewCommunity: 'View Community',
        
        // Footer
        quickLinks: 'Quick Links',
        legal: 'Legal',
        contactUs: 'Contact Us',
        
        // Notifications Panel
        notifications: 'Notifications',
        markAllRead: 'Mark all as read'
    },
    hi: {
        // Header
        home: 'होम',
        virtualTryOn: 'वर्चुअल ट्राई-ऑन',
        clothingGallery: 'कपड़ों की गैलरी',
        features: 'विशेषताएं',
        searchPlaceholder: 'खोजें...',
        
        // Hero Section
        heroTitle: 'एआई वर्चुअल कपड़े ट्राई-ऑन',
        heroSubtitle: 'हमारी अत्याधुनिक एआई तकनीक के साथ फैशन के भविष्य का अनुभव करें। खरीदने से पहले वर्चुअली कपड़े आज़माएं!',
        tryNowBtn: 'अभी आज़माएं',
        learnMoreBtn: 'और जानें',
        
        // User Dropdown
        viewProfile: 'प्रोफ़ाइल देखें',
        addressManagement: 'पता प्रबंधन',
        myOrders: 'मेरे ऑर्डर',
        paymentOptions: 'भुगतान विकल्प',
        personalization: 'वैयक्तिकरण',
        settings: 'सेटिंग्स',
        help: 'सहायता और समर्थन',
        logout: 'लॉग आउट',
        
        // Notifications
        languageChanged: 'भाषा सफलतापूर्वक बदल गई!',
        themeChanged: 'थीम बदल गई',
        mode: 'मोड',
        
        // Try-On Section
        virtualTryOnStudio: '👕 वर्चुअल ट्राई-ऑन स्टूडियो',
        selectClothesUpload: 'कपड़े चुनें, अपनी फोटो अपलोड करें और तुरंत परिणाम देखें।',
        selectClothes: '👕 कपड़े चुनें',
        uploadPhoto: '📸 फोटो अपलोड करें',
        result: '👁️ परिणाम',
        uploadYourCloth: 'अपना कपड़ा अपलोड करें',
        generateResult: 'परिणाम जनरेट करें',
        reset: 'रीसेट',
        save: 'सेव करें',
        download: 'डाउनलोड',
        share: 'शेयर करें',
        startTryOn: 'अभी ट्राई-ऑन शुरू करें',
        
        // Gallery Section
        clothingGallery: '👕 कपड़ों की गैलरी',
        browseCollection: 'हमारे कलेक्शन को ब्राउज़ करें और आइटम चुनें। अपने वर्चुअल फिटिंग रूम में जोड़ने के लिए "ट्राई ऑन" पर क्लिक करें।',
        
        // How It Works
        howItWorks: 'यह कैसे काम करता है',
        aiPoweredSystem: 'हमारी एआई-संचालित प्रणाली यथार्थवादी वर्चुअल ट्राई-ऑन अनुभव प्रदान करने के लिए अत्याधुनिक तकनीक का उपयोग करती है।',
        uploadYourPhoto: 'अपनी फोटो अपलोड करें',
        chooseClothing: 'कपड़े चुनें',
        aiTryOn: 'एआई ट्राई-ऑन',
        saveShare: 'सेव और शेयर करें',
        
        // Exclusive Features
        exclusiveFeatures: '✨ विशेष सुविधाएं',
        discoverUnique: 'अनोखी सुविधाओं की खोज करें जो आपके शॉपिंग अनुभव को असाधारण बनाती हैं',
        aiStyleAdvisor: '🤖 एआई स्टाइल सलाहकार',
        virtualWardrobeMixer: '🎨 वर्चुअल वार्डरोब मिक्सर',
        socialSharingVoting: '👥 सोशल शेयरिंग और वोटिंग',
        getRecommendations: 'सिफारिशें प्राप्त करें',
        startMixing: 'मिक्सिंग शुरू करें',
        viewCommunity: 'समुदाय देखें',
        
        // Footer
        quickLinks: 'त्वरित लिंक',
        legal: 'कानूनी',
        contactUs: 'हमसे संपर्क करें',
        
        // Notifications Panel
        notifications: 'सूचनाएं',
        markAllRead: 'सभी को पढ़ा हुआ चिह्नित करें'
    },
    gu: {
        // Header
        home: 'હોમ',
        virtualTryOn: 'વર્ચ્યુઅલ ટ્રાય-ઓન',
        clothingGallery: 'કપડાંની ગેલેરી',
        features: 'વિશેષતાઓ',
        searchPlaceholder: 'શોધો...',
        
        // Hero Section
        heroTitle: 'AI વર્ચ્યુઅલ કપડાં ટ્રાય-ઓન',
        heroSubtitle: 'અમારી અદ્યતન AI ટેકનોલોજી સાથે ફેશનના ભવિષ્યનો અનુભવ કરો. ખરીદતા પહેલા વર્ચ્યુઅલી કપડાં અજમાવો!',
        tryNowBtn: 'હમણાં અજમાવો',
        learnMoreBtn: 'વધુ જાણો',
        
        // User Dropdown
        viewProfile: 'પ્રોફાઇલ જુઓ',
        addressManagement: 'સરનામું વ્યવસ્થાપન',
        myOrders: 'મારા ઓર્ડર',
        paymentOptions: 'ચુકવણી વિકલ્પો',
        personalization: 'વ્યક્તિગતકરણ',
        settings: 'સેટિંગ્સ',
        help: 'મદદ અને સપોર્ટ',
        logout: 'લૉગ આઉટ',
        
        // Notifications
        languageChanged: 'ભાષા સફળતાપૂર્વક બદલાઈ ગઈ!',
        themeChanged: 'થીમ બદલાઈ ગઈ',
        mode: 'મોડ',
        
        // Try-On Section
        virtualTryOnStudio: '👕 વર્ચ્યુઅલ ટ્રાય-ઓન સ્ટુડિયો',
        selectClothesUpload: 'કપડાં પસંદ કરો, તમારો ફોટો અપલોડ કરો અને તાત્કાલિક પરિણામો જુઓ।',
        selectClothes: '👕 કપડાં પસંદ કરો',
        uploadPhoto: '📸 ફોટો અપલોડ કરો',
        result: '👁️ પરિણામ',
        uploadYourCloth: 'તમારા કપડાં અપલોડ કરો',
        generateResult: 'પરિણામ જનરેટ કરો',
        reset: 'રીસેટ',
        save: 'સેવ કરો',
        download: 'ડાઉનલોડ',
        share: 'શેર કરો',
        startTryOn: 'હમણાં ટ્રાય-ઓન શરૂ કરો',
        
        // Gallery Section
        clothingGallery: '👕 કપડાંની ગેલેરી',
        browseCollection: 'અમારા કલેક્શનને બ્રાઉઝ કરો અને આઇટમ્સ પસંદ કરો. તમારા વર્ચ્યુઅલ ફિટિંગ રૂમમાં ઉમેરવા માટે "ટ્રાય ઓન" પર ક્લિક કરો।',
        
        // How It Works
        howItWorks: 'તે કેવી રીતે કામ કરે છે',
        aiPoweredSystem: 'અમારી AI-સંચાલિત સિસ્ટમ વાસ્તવિક વર્ચ્યુઅલ ટ્રાય-ઓન અનુભવો પ્રદાન કરવા માટે અદ્યતન ટેકનોલોજીનો ઉપયોગ કરે છે।',
        uploadYourPhoto: 'તમારો ફોટો અપલોડ કરો',
        chooseClothing: 'કપડાં પસંદ કરો',
        aiTryOn: 'AI ટ્રાય-ઓન',
        saveShare: 'સેવ અને શેર કરો',
        
        // Exclusive Features
        exclusiveFeatures: '✨ વિશિષ્ટ સુવિધાઓ',
        discoverUnique: 'અનન્ય સુવિધાઓ શોધો જે તમારા શોપિંગ અનુભવને અસાધારણ બનાવે છે',
        aiStyleAdvisor: '🤖 AI સ્ટાઇલ સલાહકાર',
        virtualWardrobeMixer: '🎨 વર્ચ્યુઅલ વોર્ડરોબ મિક્સર',
        socialSharingVoting: '👥 સોશિયલ શેરિંગ અને વોટિંગ',
        getRecommendations: 'ભલામણો મેળવો',
        startMixing: 'મિક્સિંગ શરૂ કરો',
        viewCommunity: 'સમુદાય જુઓ',
        
        // Footer
        quickLinks: 'ઝડપી લિંક્સ',
        legal: 'કાનૂની',
        contactUs: 'અમારો સંપર્ક કરો',
        
        // Notifications Panel
        notifications: 'સૂચનાઓ',
        markAllRead: 'બધાને વાંચેલા તરીકે ચિહ્નિત કરો'
    },
    es: {
        // Header
        home: 'Inicio',
        virtualTryOn: 'Probador Virtual',
        clothingGallery: 'Galería de Ropa',
        features: 'Características',
        searchPlaceholder: 'Buscar...',
        
        // Hero Section
        heroTitle: 'Probador Virtual de Ropa con IA',
        heroSubtitle: '¡Experimenta el futuro de la moda con nuestra tecnología de IA de vanguardia. Pruébate la ropa virtualmente antes de comprar!',
        tryNowBtn: 'Probar Ahora',
        learnMoreBtn: 'Saber Más',
        
        // User Dropdown
        viewProfile: 'Ver Perfil',
        addressManagement: 'Gestión de Direcciones',
        myOrders: 'Mis Pedidos',
        paymentOptions: 'Opciones de Pago',
        personalization: 'Personalización',
        settings: 'Configuración',
        help: 'Ayuda y Soporte',
        logout: 'Cerrar Sesión',
        
        // Notifications
        languageChanged: '¡Idioma cambiado exitosamente!',
        themeChanged: 'Tema cambiado a',
        mode: 'modo'
    },
    fr: {
        // Header
        home: 'Accueil',
        virtualTryOn: 'Essayage Virtuel',
        clothingGallery: 'Galerie de Vêtements',
        features: 'Fonctionnalités',
        searchPlaceholder: 'Rechercher...',
        
        // Hero Section
        heroTitle: 'Essayage Virtuel de Vêtements IA',
        heroSubtitle: 'Découvrez l\'avenir de la mode avec notre technologie IA de pointe. Essayez des vêtements virtuellement avant d\'acheter!',
        tryNowBtn: 'Essayer Maintenant',
        learnMoreBtn: 'En Savoir Plus',
        
        // User Dropdown
        viewProfile: 'Voir le Profil',
        addressManagement: 'Gestion des Adresses',
        myOrders: 'Mes Commandes',
        paymentOptions: 'Options de Paiement',
        personalization: 'Personnalisation',
        settings: 'Paramètres',
        help: 'Aide et Support',
        logout: 'Se Déconnecter',
        
        // Notifications
        languageChanged: 'Langue changée avec succès!',
        themeChanged: 'Thème changé en',
        mode: 'mode'
    },
    de: {
        // Header
        home: 'Startseite',
        virtualTryOn: 'Virtuelles Anprobieren',
        clothingGallery: 'Kleidergalerie',
        features: 'Funktionen',
        searchPlaceholder: 'Suchen...',
        
        // Hero Section
        heroTitle: 'KI Virtuelle Kleideranprobe',
        heroSubtitle: 'Erleben Sie die Zukunft der Mode mit unserer hochmodernen KI-Technologie. Probieren Sie Kleidung virtuell an, bevor Sie kaufen!',
        tryNowBtn: 'Jetzt Ausprobieren',
        learnMoreBtn: 'Mehr Erfahren',
        
        // User Dropdown
        viewProfile: 'Profil Anzeigen',
        addressManagement: 'Adressverwaltung',
        myOrders: 'Meine Bestellungen',
        paymentOptions: 'Zahlungsoptionen',
        personalization: 'Personalisierung',
        settings: 'Einstellungen',
        help: 'Hilfe & Support',
        logout: 'Abmelden',
        
        // Notifications
        languageChanged: 'Sprache erfolgreich geändert!',
        themeChanged: 'Design geändert zu',
        mode: 'Modus'
    },
    zh: {
        // Header
        home: '首页',
        virtualTryOn: '虚拟试衣',
        clothingGallery: '服装画廊',
        features: '功能',
        searchPlaceholder: '搜索...',
        
        // Hero Section
        heroTitle: 'AI虚拟试衣',
        heroSubtitle: '体验我们尖端AI技术带来的时尚未来。购买前虚拟试穿衣服！',
        tryNowBtn: '立即试用',
        learnMoreBtn: '了解更多',
        
        // User Dropdown
        viewProfile: '查看个人资料',
        addressManagement: '地址管理',
        myOrders: '我的订单',
        paymentOptions: '支付选项',
        personalization: '个性化',
        settings: '设置',
        help: '帮助与支持',
        logout: '退出登录',
        
        // Notifications
        languageChanged: '语言更改成功！',
        themeChanged: '主题已更改为',
        mode: '模式'
    },
    ar: {
        // Header
        home: 'الرئيسية',
        virtualTryOn: 'التجربة الافتراضية',
        clothingGallery: 'معرض الملابس',
        features: 'المميزات',
        searchPlaceholder: 'بحث...',
        
        // Hero Section
        heroTitle: 'تجربة الملابس الافتراضية بالذكاء الاصطناعي',
        heroSubtitle: 'اختبر مستقبل الموضة مع تقنية الذكاء الاصطناعي المتطورة لدينا. جرب الملابس افتراضيًا قبل الشراء!',
        tryNowBtn: 'جرب الآن',
        learnMoreBtn: 'اعرف المزيد',
        
        // User Dropdown
        viewProfile: 'عرض الملف الشخصي',
        addressManagement: 'إدارة العناوين',
        myOrders: 'طلباتي',
        paymentOptions: 'خيارات الدفع',
        personalization: 'التخصيص',
        settings: 'الإعدادات',
        help: 'المساعدة والدعم',
        logout: 'تسجيل الخروج',
        
        // Notifications
        languageChanged: 'تم تغيير اللغة بنجاح!',
        themeChanged: 'تم تغيير المظهر إلى',
        mode: 'وضع'
    }
};

function changeLanguage(language) {
    localStorage.setItem('language', language);
    
    // Apply translations
    applyTranslations(language);
    
    showNotification(translations[language].languageChanged, 'success');
}

function applyTranslations(lang) {
    const t = translations[lang];
    
    // Update navigation
    const navLinks = document.querySelectorAll('nav a');
    if (navLinks.length >= 4) {
        navLinks[0].textContent = t.home;
        navLinks[1].textContent = t.virtualTryOn;
        navLinks[2].textContent = t.clothingGallery;
        navLinks[3].textContent = t.features;
    }
    
    // Update search placeholder
    const searchInput = document.querySelector('.search-container input');
    if (searchInput) {
        searchInput.placeholder = t.searchPlaceholder;
    }
    
    // Update hero section
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        heroTitle.textContent = t.heroTitle;
    }
    
    const heroSubtitle = document.querySelector('.hero p');
    if (heroSubtitle) {
        heroSubtitle.textContent = t.heroSubtitle;
    }
    
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    if (heroButtons.length >= 1) {
        heroButtons[0].textContent = t.startTryOn;
    }
    
    // Update user dropdown menu
    const dropdownItems = document.querySelectorAll('.dropdown-item span');
    if (dropdownItems.length >= 8) {
        dropdownItems[0].textContent = t.viewProfile;
        dropdownItems[1].textContent = t.addressManagement;
        dropdownItems[2].textContent = t.myOrders;
        dropdownItems[3].textContent = t.paymentOptions;
        dropdownItems[4].textContent = t.personalization;
        dropdownItems[5].textContent = t.settings;
        dropdownItems[6].textContent = t.help;
        dropdownItems[7].textContent = t.logout;
    }
    
    // Update Try-On Section
    const tryOnTitle = document.querySelector('#try-on h2');
    if (tryOnTitle) tryOnTitle.textContent = t.virtualTryOnStudio;
    
    const tryOnSubtitle = document.querySelector('#try-on p');
    if (tryOnSubtitle) tryOnSubtitle.textContent = t.selectClothesUpload;
    
    // Update section headers
    const sectionHeaders = document.querySelectorAll('.section-header h3');
    if (sectionHeaders.length >= 3) {
        sectionHeaders[0].textContent = t.selectClothes;
        sectionHeaders[1].textContent = t.uploadPhoto;
        sectionHeaders[2].textContent = t.result;
    }
    
    // Update buttons
    const uploadClothBtn = document.getElementById('uploadClothBtn');
    if (uploadClothBtn) uploadClothBtn.innerHTML = `<i class="fas fa-upload"></i> ${t.uploadYourCloth}`;
    
    const tryOnBtn = document.getElementById('tryOnBtn');
    if (tryOnBtn) tryOnBtn.textContent = t.generateResult;
    
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.textContent = t.reset;
    
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) saveBtn.textContent = t.save;
    
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) downloadBtn.innerHTML = `<i class="fas fa-download"></i> ${t.download}`;
    
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) shareBtn.textContent = t.share;
    
    // Update Gallery Section
    const galleryTitle = document.querySelector('#gallery h2');
    if (galleryTitle) galleryTitle.textContent = t.clothingGallery;
    
    const gallerySubtitle = document.querySelector('#gallery p');
    if (gallerySubtitle) gallerySubtitle.textContent = t.browseCollection;
    
    // Update How It Works Section
    const howItWorksTitle = document.querySelector('#features h2');
    if (howItWorksTitle) howItWorksTitle.textContent = t.howItWorks;
    
    const howItWorksSubtitle = document.querySelector('#features + p');
    if (howItWorksSubtitle) howItWorksSubtitle.textContent = t.aiPoweredSystem;
    
    // Update feature cards
    const featureCards = document.querySelectorAll('.feature-card h3');
    if (featureCards.length >= 4) {
        featureCards[0].textContent = t.uploadYourPhoto;
        featureCards[1].textContent = t.chooseClothing;
        featureCards[2].textContent = t.aiTryOn;
        featureCards[3].textContent = t.saveShare;
    }
    
    // Update Exclusive Features Section
    const exclusiveTitle = document.querySelector('#exclusive-features h2');
    if (exclusiveTitle) exclusiveTitle.textContent = t.exclusiveFeatures;
    
    const exclusiveSubtitle = document.querySelector('#exclusive-features p');
    if (exclusiveSubtitle) exclusiveSubtitle.textContent = t.discoverUnique;
    
    // Update exclusive feature cards
    const exclusiveCards = document.querySelectorAll('.exclusive-feature-card h3');
    if (exclusiveCards.length >= 3) {
        exclusiveCards[0].textContent = t.aiStyleAdvisor;
        exclusiveCards[1].textContent = t.virtualWardrobeMixer;
        exclusiveCards[2].textContent = t.socialSharingVoting;
    }
    
    const exclusiveBtns = document.querySelectorAll('.exclusive-feature-card .btn');
    if (exclusiveBtns.length >= 3) {
        exclusiveBtns[0].textContent = t.getRecommendations;
        exclusiveBtns[1].textContent = t.startMixing;
        exclusiveBtns[2].textContent = t.viewCommunity;
    }
    
    // Update Footer
    const footerColumns = document.querySelectorAll('.footer-column h3');
    if (footerColumns.length >= 4) {
        footerColumns[1].textContent = t.quickLinks;
        footerColumns[2].textContent = t.legal;
        footerColumns[3].textContent = t.contactUs;
    }
    
    // Update notification header
    const notificationHeader = document.querySelector('.notification-header h3');
    if (notificationHeader) notificationHeader.textContent = t.notifications;
    
    const markAllRead = document.querySelector('.mark-all-read');
    if (markAllRead) markAllRead.textContent = t.markAllRead;
}

// Apply saved language on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    applyTranslations(savedLanguage);
});

// Settings Modal
function openSettings(event) {
    if (event) event.preventDefault();
    const dropdown = document.getElementById('userDropdownMenu');
    if (dropdown) dropdown.classList.remove('show');
    
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.add('show');
        loadSettingsData();
    }
}

function closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.remove('show');
}

function loadSettingsData() {
    // Load privacy settings
    const profileVisibility = localStorage.getItem('profileVisibility') !== 'false';
    const showActivity = localStorage.getItem('showActivity') !== 'false';
    
    const profileVisibilityCheckbox = document.getElementById('profileVisibility');
    const showActivityCheckbox = document.getElementById('showActivity');
    
    if (profileVisibilityCheckbox) profileVisibilityCheckbox.checked = profileVisibility;
    if (showActivityCheckbox) showActivityCheckbox.checked = showActivity;
    
    // Load notification settings
    const emailNotifications = localStorage.getItem('emailNotifications') !== 'false';
    const pushNotifications = localStorage.getItem('pushNotifications') !== 'false';
    
    const emailCheckbox = document.getElementById('emailNotifications');
    const pushCheckbox = document.getElementById('pushNotifications');
    
    if (emailCheckbox) emailCheckbox.checked = emailNotifications;
    if (pushCheckbox) pushCheckbox.checked = pushNotifications;
}

// Authentication verification function
function verifyUserAuthentication(action) {
    return new Promise((resolve, reject) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const email = user.email || '';
        // Check multiple possible field names for phone
        const phone = user.phone || user.phoneNumber || user.mobile || user.mobileNumber || '';
        
        // For testing: if no phone, use a dummy one
        const hasPhone = phone !== '';
        const hasEmail = email !== '';
        
        // Create verification modal
        const verificationModal = document.createElement('div');
        verificationModal.className = 'settings-modal-overlay show';
        verificationModal.innerHTML = `
            <div class="settings-modal-content" style="max-width: 450px;">
                <div class="settings-modal-header">
                    <h2><i class="fas fa-shield-alt"></i> Verify Identity</h2>
                    <button class="settings-modal-close" onclick="this.closest('.settings-modal-overlay').remove(); if(window._authVerificationReject) window._authVerificationReject();">&times;</button>
                </div>
                <div class="settings-modal-body">
                    <p style="margin-bottom: 20px; color: var(--text-secondary);">
                        For security, please verify your identity to ${action}.
                    </p>
                    <div class="settings-section">
                        <h3>Choose Verification Method</h3>
                        <button class="settings-btn" onclick="verifyViaEmail('${email || 'your email'}', this)" ${!hasEmail ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                            <i class="fas fa-envelope"></i> Verify via Email
                            <small style="display: block; font-weight: normal; margin-top: 4px;">${hasEmail ? maskEmail(email) : 'No email added - Please add in profile'}</small>
                        </button>
                        <button class="settings-btn" onclick="verifyViaMobile('${phone || 'your mobile'}', this)" ${!hasPhone ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                            <i class="fas fa-mobile-alt"></i> Verify via Mobile
                            <small style="display: block; font-weight: normal; margin-top: 4px;">${hasPhone ? maskPhone(phone) : 'No mobile added - Please add in profile'}</small>
                        </button>
                        ${!hasEmail && !hasPhone ? `
                        <p style="color: #dc3545; padding: 15px; background: rgba(220, 53, 69, 0.1); border-radius: 8px; margin-top: 15px;">
                            <i class="fas fa-exclamation-triangle"></i> Please add email or phone number in your profile first.
                        </p>
                        <button class="settings-btn" onclick="window.location.href='profile.html'" style="margin-top: 10px;">
                            <i class="fas fa-user-edit"></i> Go to Profile
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(verificationModal);
        
        // Store resolve/reject for later use
        window._authVerificationResolve = resolve;
        window._authVerificationReject = reject;
    });
}

// Mask email for privacy
function maskEmail(email) {
    const [username, domain] = email.split('@');
    const maskedUsername = username.charAt(0) + '***' + username.charAt(username.length - 1);
    return maskedUsername + '@' + domain;
}

// Mask phone for privacy
function maskPhone(phone) {
    if (phone.length < 4) return '***';
    return '***' + phone.slice(-4);
}

// Verify via Email
window.verifyViaEmail = function(email, button) {
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending OTP...';
    
    // Simulate sending OTP
    setTimeout(() => {
        const otp = prompt(`Enter the OTP sent to ${maskEmail(email)}:`);
        
        if (otp) {
            // Simulate OTP verification (in real app, verify with backend)
            if (otp.length === 6 || otp === '123456') {
                showNotification('Email verified successfully!', 'success');
                document.querySelector('.settings-modal-overlay.show').remove();
                if (window._authVerificationResolve) {
                    window._authVerificationResolve(true);
                }
            } else {
                showNotification('Invalid OTP. Please try again.', 'error');
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-envelope"></i> Verify via Email';
            }
        } else {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-envelope"></i> Verify via Email';
        }
    }, 1500);
};

// Verify via Mobile
window.verifyViaMobile = function(phone, button) {
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending OTP...';
    
    // Simulate sending OTP
    setTimeout(() => {
        const otp = prompt(`Enter the OTP sent to ${maskPhone(phone)}:`);
        
        if (otp) {
            // Simulate OTP verification (in real app, verify with backend)
            if (otp.length === 6 || otp === '123456') {
                showNotification('Mobile verified successfully!', 'success');
                document.querySelector('.settings-modal-overlay.show').remove();
                if (window._authVerificationResolve) {
                    window._authVerificationResolve(true);
                }
            } else {
                showNotification('Invalid OTP. Please try again.', 'error');
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-mobile-alt"></i> Verify via Mobile';
            }
        } else {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-mobile-alt"></i> Verify via Mobile';
        }
    }, 1500);
};

// Updated Edit Profile function with authentication
window.editProfileWithAuth = async function() {
    closeSettingsModal();
    
    try {
        const verified = await verifyUserAuthentication('edit your profile');
        if (verified) {
            window.location.href = 'profile.html';
        }
    } catch (error) {
        showNotification('Verification cancelled', 'info');
    }
};

// Updated Change Password function with authentication
function changePassword() {
    closeSettingsModal();
    
    verifyUserAuthentication('change your password')
        .then(verified => {
            if (verified) {
                // Show password change form
                const newPassword = prompt('Enter new password (minimum 6 characters):');
                if (newPassword && newPassword.length >= 6) {
                    const confirmPassword = prompt('Confirm new password:');
                    if (confirmPassword === newPassword) {
                        // In a real app, this would call an API
                        showNotification('Password changed successfully!', 'success');
                    } else {
                        showNotification('Passwords do not match!', 'error');
                    }
                } else if (newPassword) {
                    showNotification('Password must be at least 6 characters', 'error');
                }
            }
        })
        .catch(() => {
            showNotification('Verification cancelled', 'info');
        });
}

function savePrivacySettings() {
    const profileVisibility = document.getElementById('profileVisibility').checked;
    const showActivity = document.getElementById('showActivity').checked;
    
    localStorage.setItem('profileVisibility', profileVisibility);
    localStorage.setItem('showActivity', showActivity);
    
    showNotification('Privacy settings saved', 'success');
}

function saveNotificationSettings() {
    const emailNotifications = document.getElementById('emailNotifications').checked;
    const pushNotifications = document.getElementById('pushNotifications').checked;
    
    localStorage.setItem('emailNotifications', emailNotifications);
    localStorage.setItem('pushNotifications', pushNotifications);
    
    showNotification('Notification settings saved', 'success');
}

function downloadData() {
    closeSettingsModal();
    showNotification('Preparing your data for download...', 'info');
    
    // Simulate data download
    setTimeout(() => {
        const userData = {
            user: JSON.parse(localStorage.getItem('user') || '{}'),
            settings: {
                theme: localStorage.getItem('theme'),
                language: localStorage.getItem('language'),
                profileVisibility: localStorage.getItem('profileVisibility'),
                showActivity: localStorage.getItem('showActivity')
            },
            timestamp: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'my-data.json';
        link.click();
        URL.revokeObjectURL(url);
        
        showNotification('Data downloaded successfully!', 'success');
    }, 1500);
}

function deleteAccount() {
    closeSettingsModal();
    const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    
    if (confirmation) {
        const finalConfirmation = prompt('Type "DELETE" to confirm account deletion:');
        if (finalConfirmation === 'DELETE') {
            // In a real app, this would call an API
            showNotification('Account deletion initiated. You will receive a confirmation email.', 'info');
            setTimeout(() => {
                localStorage.clear();
                window.location.href = 'signup.html';
            }, 2000);
        } else {
            showNotification('Account deletion cancelled', 'info');
        }
    }
}

// Help Modal
function openHelp(event) {
    if (event) event.preventDefault();
    const dropdown = document.getElementById('userDropdownMenu');
    if (dropdown) dropdown.classList.remove('show');
    
    const modal = document.getElementById('helpModal');
    if (modal) {
        // Restore original Help modal content
        const modalBody = modal.querySelector('.settings-modal-body');
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="help-section">
                    <h3>Quick Links</h3>
                    <a href="#" class="help-link" onclick="showFAQ(event)">
                        <i class="fas fa-question"></i>
                        <div>
                            <strong>Frequently Asked Questions</strong>
                            <p>Find answers to common questions</p>
                        </div>
                    </a>
                    <a href="#" class="help-link" onclick="showTutorial(event)">
                        <i class="fas fa-graduation-cap"></i>
                        <div>
                            <strong>Getting Started Tutorial</strong>
                            <p>Learn how to use the platform</p>
                        </div>
                    </a>
                    <a href="#" class="help-link" onclick="contactSupport(event)">
                        <i class="fas fa-headset"></i>
                        <div>
                            <strong>Contact Support</strong>
                            <p>Get help from our support team</p>
                        </div>
                    </a>
                </div>
                <div class="help-section">
                    <h3>Resources</h3>
                    <a href="#" class="help-link" onclick="showDocumentation(event)">
                        <i class="fas fa-book"></i>
                        <div>
                            <strong>Documentation</strong>
                            <p>Detailed guides and references</p>
                        </div>
                    </a>
                    <a href="#" class="help-link" onclick="reportBug(event)">
                        <i class="fas fa-bug"></i>
                        <div>
                            <strong>Report a Bug</strong>
                            <p>Help us improve the platform</p>
                        </div>
                    </a>
                </div>
                <div class="help-section">
                    <h3>Contact Information</h3>
                    <p><i class="fas fa-envelope"></i> support@dressify.com</p>
                    <p><i class="fas fa-phone"></i> +1 (555) 123-4567</p>
                    <p><i class="fas fa-clock"></i> Mon-Fri, 9AM-6PM EST</p>
                </div>
            `;
        }
        modal.classList.add('show');
    }
}

function closeHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) modal.classList.remove('show');
}

function showFAQ(event) {
    event.preventDefault();
    closeHelpModal();
    
    // Create FAQ content
    const faqContent = `
        <div style="max-width: 800px; margin: 20px auto; padding: 20px;">
            <h2 style="color: var(--primary-color); margin-bottom: 20px;">
                <i class="fas fa-question-circle"></i> Frequently Asked Questions
            </h2>
            
            <div style="background: var(--bg-secondary); padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                <h3 style="color: var(--text-primary); margin-bottom: 10px;">How do I try on clothes virtually?</h3>
                <p style="color: var(--text-secondary);">Upload your photo, select clothing items from our catalog, and click "Try On" to see how they look on you using AI technology.</p>
            </div>
            
            <div style="background: var(--bg-secondary); padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                <h3 style="color: var(--text-primary); margin-bottom: 10px;">How do I save my favorite items?</h3>
                <p style="color: var(--text-secondary);">Click the heart icon on any clothing item to add it to your wishlist. Access your wishlist from your profile menu.</p>
            </div>
            
            <div style="background: var(--bg-secondary); padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                <h3 style="color: var(--text-primary); margin-bottom: 10px;">Can I change my profile information?</h3>
                <p style="color: var(--text-secondary);">Yes! Go to Settings > Account Settings and click "Edit Profile" to update your information.</p>
            </div>
            
            <div style="background: var(--bg-secondary); padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                <h3 style="color: var(--text-primary); margin-bottom: 10px;">How do I add a delivery address?</h3>
                <p style="color: var(--text-secondary);">Click on your profile menu, select "Address Management", and click "Add New Address" to save delivery addresses.</p>
            </div>
            
            <div style="background: var(--bg-secondary); padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                <h3 style="color: var(--text-primary); margin-bottom: 10px;">What payment methods are supported?</h3>
                <p style="color: var(--text-secondary);">We support Credit/Debit Cards, UPI, Google Pay, PhonePe, Paytm, Net Banking, Amazon Pay, and Cash on Delivery.</p>
            </div>
            
            <button onclick="openHelp()" style="background: var(--primary-color); color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                <i class="fas fa-arrow-left"></i> Back to Help
            </button>
        </div>
    `;
    
    showNotification('Loading FAQ...', 'info');
    setTimeout(() => {
        const helpModal = document.getElementById('helpModal');
        if (helpModal) {
            const modalBody = helpModal.querySelector('.settings-modal-body');
            if (modalBody) {
                modalBody.innerHTML = faqContent;
                helpModal.classList.add('show');
            }
        }
    }, 300);
}

function showTutorial(event) {
    event.preventDefault();
    closeHelpModal();
    
    // Create tutorial content
    const tutorialContent = `
        <div style="max-width: 800px; margin: 20px auto; padding: 20px;">
            <h2 style="color: var(--primary-color); margin-bottom: 20px;">
                <i class="fas fa-graduation-cap"></i> Getting Started Tutorial
            </h2>
            
            <div style="background: var(--bg-secondary); padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                <h3 style="color: var(--text-primary); margin-bottom: 10px;">
                    <span style="background: var(--primary-color); color: white; padding: 5px 10px; border-radius: 50%; margin-right: 10px;">1</span>
                    Create Your Account
                </h3>
                <p style="color: var(--text-secondary);">Sign up with your email and create a secure password to get started.</p>
            </div>
            
            <div style="background: var(--bg-secondary); padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                <h3 style="color: var(--text-primary); margin-bottom: 10px;">
                    <span style="background: var(--primary-color); color: white; padding: 5px 10px; border-radius: 50%; margin-right: 10px;">2</span>
                    Upload Your Photo
                </h3>
                <p style="color: var(--text-secondary);">Take or upload a clear, full-body photo for the best virtual try-on experience.</p>
            </div>
            
            <div style="background: var(--bg-secondary); padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                <h3 style="color: var(--text-primary); margin-bottom: 10px;">
                    <span style="background: var(--primary-color); color: white; padding: 5px 10px; border-radius: 50%; margin-right: 10px;">3</span>
                    Browse Clothing
                </h3>
                <p style="color: var(--text-secondary);">Explore our catalog of clothing items and select what you want to try on.</p>
            </div>
            
            <div style="background: var(--bg-secondary); padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                <h3 style="color: var(--text-primary); margin-bottom: 10px;">
                    <span style="background: var(--primary-color); color: white; padding: 5px 10px; border-radius: 50%; margin-right: 10px;">4</span>
                    Try On Virtually
                </h3>
                <p style="color: var(--text-secondary);">Click "Try On" and our AI will show you how the clothes look on you!</p>
            </div>
            
            <div style="background: var(--bg-secondary); padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                <h3 style="color: var(--text-primary); margin-bottom: 10px;">
                    <span style="background: var(--primary-color); color: white; padding: 5px 10px; border-radius: 50%; margin-right: 10px;">5</span>
                    Save & Share
                </h3>
                <p style="color: var(--text-secondary);">Save your favorite looks to your wishlist and share them with friends!</p>
            </div>
            
            <button onclick="openHelp()" style="background: var(--primary-color); color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                <i class="fas fa-arrow-left"></i> Back to Help
            </button>
        </div>
    `;
    
    showNotification('Loading tutorial...', 'info');
    setTimeout(() => {
        const helpModal = document.getElementById('helpModal');
        if (helpModal) {
            const modalBody = helpModal.querySelector('.settings-modal-body');
            if (modalBody) {
                modalBody.innerHTML = tutorialContent;
                helpModal.classList.add('show');
            }
        }
    }, 300);
}

function contactSupport(event) {
    event.preventDefault();
    closeHelpModal();
    
    // Create contact support form
    const supportContent = `
        <div style="max-width: 600px; margin: 20px auto; padding: 20px;">
            <h2 style="color: var(--primary-color); margin-bottom: 20px;">
                <i class="fas fa-headset"></i> Contact Support
            </h2>
            
            <form id="supportForm" style="background: var(--bg-secondary); padding: 25px; border-radius: 10px;">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Your Name *</label>
                    <input type="text" id="supportName" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Email Address *</label>
                    <input type="email" id="supportEmail" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Subject *</label>
                    <input type="text" id="supportSubject" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Message *</label>
                    <textarea id="supportMessage" required rows="6" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; resize: vertical;"></textarea>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button type="submit" style="flex: 1; background: var(--primary); color: white; padding: 12px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">
                        <i class="fas fa-paper-plane"></i> Send Message
                    </button>
                    <button type="button" onclick="openHelp()" style="background: var(--border-color); color: var(--text-primary); padding: 12px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
            
            <div style="margin-top: 25px; padding: 20px; background: var(--bg-secondary); border-radius: 10px;">
                <h3 style="color: var(--text-primary); margin-bottom: 15px;">Other Ways to Reach Us</h3>
                <p style="color: var(--text-secondary); margin-bottom: 10px;">
                    <i class="fas fa-envelope" style="color: var(--primary-color); margin-right: 10px;"></i>
                    support@dressify.com
                </p>
                <p style="color: var(--text-secondary); margin-bottom: 10px;">
                    <i class="fas fa-phone" style="color: var(--primary-color); margin-right: 10px;"></i>
                    +1 (555) 123-4567
                </p>
                <p style="color: var(--text-secondary);">
                    <i class="fas fa-clock" style="color: var(--primary-color); margin-right: 10px;"></i>
                    Mon-Fri, 9AM-6PM EST
                </p>
            </div>
        </div>
    `;
    
    showNotification('Loading contact form...', 'info');
    setTimeout(() => {
        const helpModal = document.getElementById('helpModal');
        if (helpModal) {
            const modalBody = helpModal.querySelector('.settings-modal-body');
            if (modalBody) {
                modalBody.innerHTML = supportContent;
                helpModal.classList.add('show');
                
                // Add form submit handler
                const form = document.getElementById('supportForm');
                if (form) {
                    form.addEventListener('submit', function(e) {
                        e.preventDefault();
                        const name = document.getElementById('supportName').value;
                        const email = document.getElementById('supportEmail').value;
                        const subject = document.getElementById('supportSubject').value;
                        const message = document.getElementById('supportMessage').value;
                        
                        if (name && email && subject && message) {
                            // Generate unique ticket token
                            const now = new Date();
                            const dateStr = now.getFullYear().toString() + 
                                String(now.getMonth() + 1).padStart(2, '0') + 
                                String(now.getDate()).padStart(2, '0');
                            const randomNum = String(Math.floor(10000 + Math.random() * 90000));
                            const ticketToken = `DRS-${dateStr}-${randomNum}`;
                            
                            // Save ticket to localStorage
                            const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
                            tickets.push({
                                token: ticketToken,
                                name: name,
                                email: email,
                                subject: subject,
                                message: message,
                                status: 'Open',
                                createdAt: now.toISOString()
                            });
                            localStorage.setItem('supportTickets', JSON.stringify(tickets));
                            
                            // Show ticket confirmation in modal
                            const modalBody = helpModal.querySelector('.settings-modal-body');
                            if (modalBody) {
                                modalBody.innerHTML = `
                                    <div style="max-width: 600px; margin: 20px auto; padding: 20px; text-align: center;">
                                        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 15px; margin-bottom: 25px;">
                                            <i class="fas fa-check-circle" style="font-size: 50px; margin-bottom: 15px; display: block;"></i>
                                            <h2 style="margin: 0 0 10px 0; font-size: 22px;">Support Ticket Created!</h2>
                                            <p style="margin: 0; opacity: 0.9; font-size: 14px;">We will respond within 24 hours.</p>
                                        </div>
                                        
                                        <div style="background: var(--bg-secondary); padding: 25px; border-radius: 12px; margin-bottom: 20px; border: 2px dashed var(--primary-color);">
                                            <p style="color: var(--text-secondary); margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Your Ticket Token</p>
                                            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                                                <h2 id="ticketTokenDisplay" style="color: var(--primary-color); margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 2px; font-family: 'Courier New', monospace;">${ticketToken}</h2>
                                                <button onclick="copyTicketToken('${ticketToken}')" style="background: var(--primary-color); color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 14px;" title="Copy Token">
                                                    <i class="fas fa-copy"></i>
                                                </button>
                                            </div>
                                            <p style="color: #f59e0b; margin: 12px 0 0 0; font-size: 12px;">
                                                <i class="fas fa-exclamation-triangle"></i> Please save this token for future reference
                                            </p>
                                        </div>
                                        
                                        <div style="background: var(--bg-secondary); padding: 20px; border-radius: 10px; text-align: left; margin-bottom: 20px;">
                                            <h3 style="color: var(--text-primary); margin: 0 0 15px 0; font-size: 16px;">
                                                <i class="fas fa-file-alt" style="color: var(--primary-color); margin-right: 8px;"></i>Ticket Details
                                            </h3>
                                            <div style="display: grid; gap: 10px;">
                                                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(128,128,128,0.2);">
                                                    <span style="color: var(--text-secondary); font-size: 13px;"><i class="fas fa-user" style="margin-right: 6px;"></i>Name</span>
                                                    <span style="color: var(--text-primary); font-weight: 500; font-size: 13px;">${name}</span>
                                                </div>
                                                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(128,128,128,0.2);">
                                                    <span style="color: var(--text-secondary); font-size: 13px;"><i class="fas fa-envelope" style="margin-right: 6px;"></i>Email</span>
                                                    <span style="color: var(--text-primary); font-weight: 500; font-size: 13px;">${email}</span>
                                                </div>
                                                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(128,128,128,0.2);">
                                                    <span style="color: var(--text-secondary); font-size: 13px;"><i class="fas fa-tag" style="margin-right: 6px;"></i>Subject</span>
                                                    <span style="color: var(--text-primary); font-weight: 500; font-size: 13px;">${subject}</span>
                                                </div>
                                                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(128,128,128,0.2);">
                                                    <span style="color: var(--text-secondary); font-size: 13px;"><i class="fas fa-clock" style="margin-right: 6px;"></i>Date</span>
                                                    <span style="color: var(--text-primary); font-weight: 500; font-size: 13px;">${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                                                    <span style="color: var(--text-secondary); font-size: 13px;"><i class="fas fa-info-circle" style="margin-right: 6px;"></i>Status</span>
                                                    <span style="background: #10b981; color: white; padding: 3px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">Open</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div style="display: flex; gap: 10px;">
                                            <button onclick="openHelp()" style="flex: 1; background: var(--primary-color); color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 500;">
                                                <i class="fas fa-arrow-left"></i> Back to Help
                                            </button>
                                            <button onclick="closeHelpModal()" style="flex: 1; background: #6b7280; color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 500;">
                                                <i class="fas fa-times"></i> Close
                                            </button>
                                        </div>
                                    </div>
                                `;
                            }
                            
                            showNotification('Support ticket created! We will respond within 24 hours.', 'success');
                        }
                    });
                }
            }
        }
    }, 300);
}

function showDocumentation(event) {
    event.preventDefault();
    closeHelpModal();
    
    // Create documentation content
    const docContent = `
        <div style="max-width: 800px; margin: 20px auto; padding: 20px;">
            <h2 style="color: var(--primary-color); margin-bottom: 20px;">
                <i class="fas fa-book"></i> Documentation
            </h2>
            
            <div style="background: var(--bg-secondary); padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                <h3 style="color: var(--text-primary); margin-bottom: 10px;">
                    <i class="fas fa-user-circle"></i> Account Management
                </h3>
                <p style="color: var(--text-secondary); margin-bottom: 10px;">Learn how to manage your account, update profile information, and customize your preferences.</p>
                <ul style="color: var(--text-secondary); margin-left: 20px;">
                    <li>Creating and verifying your account</li>
                    <li>Updating profile information</li>
                    <li>Managing privacy settings</li>
                    <li>Changing password and security</li>
                </ul>
            </div>
            
            <div style="background: var(--bg-secondary); padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                <h3 style="color: var(--text-primary); margin-bottom: 10px;">
                    <i class="fas fa-tshirt"></i> Virtual Try-On
                </h3>
                <p style="color: var(--text-secondary); margin-bottom: 10px;">Complete guide to using our AI-powered virtual try-on feature.</p>
                <ul style="color: var(--text-secondary); margin-left: 20px;">
                    <li>Uploading photos for best results</li>
                    <li>Selecting and trying on clothing</li>
                    <li>Saving and sharing your looks</li>
                    <li>Tips for accurate results</li>
                </ul>
            </div>
            
            <div style="background: var(--bg-secondary); padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                <h3 style="color: var(--text-primary); margin-bottom: 10px;">
                    <i class="fas fa-shopping-cart"></i> Shopping & Orders
                </h3>
                <p style="color: var(--text-secondary); margin-bottom: 10px;">Everything you need to know about shopping and managing orders.</p>
                <ul style="color: var(--text-secondary); margin-left: 20px;">
                    <li>Adding items to cart and wishlist</li>
                    <li>Managing delivery addresses</li>
                    <li>Payment methods and checkout</li>
                    <li>Tracking and managing orders</li>
                </ul>
            </div>
            
            <div style="background: var(--bg-secondary); padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                <h3 style="color: var(--text-primary); margin-bottom: 10px;">
                    <i class="fas fa-palette"></i> Personalization
                </h3>
                <p style="color: var(--text-secondary); margin-bottom: 10px;">Customize your experience with themes, languages, and preferences.</p>
                <ul style="color: var(--text-secondary); margin-left: 20px;">
                    <li>Changing theme (Light/Dark/Auto)</li>
                    <li>Language selection (8 languages)</li>
                    <li>Display preferences</li>
                    <li>Notification settings</li>
                </ul>
            </div>
            
            <button onclick="openHelp()" style="background: var(--primary-color); color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                <i class="fas fa-arrow-left"></i> Back to Help
            </button>
        </div>
    `;
    
    showNotification('Loading documentation...', 'info');
    setTimeout(() => {
        const helpModal = document.getElementById('helpModal');
        if (helpModal) {
            const modalBody = helpModal.querySelector('.settings-modal-body');
            if (modalBody) {
                modalBody.innerHTML = docContent;
                helpModal.classList.add('show');
            }
        }
    }, 300);
}

function reportBug(event) {
    event.preventDefault();
    closeHelpModal();
    
    // Create bug report form
    const bugContent = `
        <div style="max-width: 600px; margin: 20px auto; padding: 20px;">
            <h2 style="color: var(--primary-color); margin-bottom: 20px;">
                <i class="fas fa-bug"></i> Report a Bug
            </h2>
            
            <form id="bugReportForm" style="background: var(--bg-secondary); padding: 25px; border-radius: 10px;">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Bug Title *</label>
                    <input type="text" id="bugTitle" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" placeholder="Brief description of the issue">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Bug Category *</label>
                    <select id="bugCategory" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                        <option value="">Select category</option>
                        <option value="ui">User Interface</option>
                        <option value="tryon">Virtual Try-On</option>
                        <option value="account">Account/Login</option>
                        <option value="payment">Payment</option>
                        <option value="performance">Performance</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Detailed Description *</label>
                    <textarea id="bugDescription" required rows="6" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; resize: vertical;" placeholder="Please describe the bug in detail, including steps to reproduce"></textarea>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Your Email (optional)</label>
                    <input type="email" id="bugEmail" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" placeholder="For follow-up (optional)">
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button type="submit" style="flex: 1; background: var(--primary); color: white; padding: 12px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">
                        <i class="fas fa-paper-plane"></i> Submit Bug Report
                    </button>
                    <button type="button" onclick="openHelp()" style="background: var(--border-color); color: var(--text-primary); padding: 12px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
            
            <div style="margin-top: 25px; padding: 20px; background: #fef3c7; border-radius: 10px; border-left: 4px solid #f59e0b;">
                <p style="color: #92400e; margin: 0;">
                    <i class="fas fa-info-circle" style="margin-right: 10px;"></i>
                    <strong>Thank you for helping us improve!</strong> Your bug reports help us make the platform better for everyone.
                </p>
            </div>
        </div>
    `;
    
    showNotification('Loading bug report form...', 'info');
    setTimeout(() => {
        const helpModal = document.getElementById('helpModal');
        if (helpModal) {
            const modalBody = helpModal.querySelector('.settings-modal-body');
            if (modalBody) {
                modalBody.innerHTML = bugContent;
                helpModal.classList.add('show');
                
                // Add form submit handler
                const form = document.getElementById('bugReportForm');
                if (form) {
                    form.addEventListener('submit', function(e) {
                        e.preventDefault();
                        const title = document.getElementById('bugTitle').value;
                        const category = document.getElementById('bugCategory').value;
                        const description = document.getElementById('bugDescription').value;
                        
                        if (title && category && description) {
                            showNotification('Bug report submitted! Thank you for helping us improve.', 'success');
                            closeHelpModal();
                            // In a real app, this would send the bug report
                        }
                    });
                }
            }
        }
    }, 300);
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    const modals = ['personalizationModal', 'settingsModal', 'helpModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && event.target === modal) {
            modal.classList.remove('show');
        }
    });
});

// Remove the old openUpgradePlan function if it exists
if (typeof openUpgradePlan !== 'undefined') {
    delete window.openUpgradePlan;
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'auto';
    changeTheme(savedTheme);
});


// Edit Profile in Modal Functions
function showEditProfileForm() {
    // Hide account settings section
    const accountSettings = document.getElementById('accountSettingsSection');
    if (accountSettings) {
        accountSettings.style.display = 'none';
    }
    
    // Show edit form
    const editSection = document.getElementById('editProfileSection');
    if (editSection) {
        editSection.style.display = 'block';
        
        // Load current user data
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const firstNameInput = document.getElementById('editFirstName');
        const lastNameInput = document.getElementById('editLastName');
        const emailInput = document.getElementById('editEmail');
        const mobileInput = document.getElementById('editMobile');
        
        if (firstNameInput) firstNameInput.value = user.firstName || '';
        if (lastNameInput) lastNameInput.value = user.lastName || '';
        if (emailInput) emailInput.value = user.email || '';
        if (mobileInput) mobileInput.value = user.mobile || user.phone || '';
    }
}

function cancelEditProfile() {
    // Hide edit form
    const editSection = document.getElementById('editProfileSection');
    if (editSection) {
        editSection.style.display = 'none';
    }
    
    // Show account settings section
    const accountSettings = document.getElementById('accountSettingsSection');
    if (accountSettings) {
        accountSettings.style.display = 'block';
    }
}

async function saveProfileInModal() {
    const firstName = document.getElementById('editFirstName').value.trim();
    const lastName = document.getElementById('editLastName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const mobile = document.getElementById('editMobile').value.trim();
    
    // Validation
    if (!firstName || !lastName) {
        showNotification('First name and last name are required', 'error');
        return;
    }
    
    if (!/^[a-zA-Z]+$/.test(firstName)) {
        showNotification('First name can only contain alphabetic characters', 'error');
        return;
    }
    
    if (!/^[a-zA-Z]+$/.test(lastName)) {
        showNotification('Last name can only contain alphabetic characters', 'error');
        return;
    }

    if (!email) {
        showNotification('Email is required', 'error');
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    const updatedData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobile: mobile
    };
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5002/api/auth/update-profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Update local storage
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, ...updatedData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Update UI
            updateUserInfoInUI(updatedUser);
            
            // Hide form and show buttons
            cancelEditProfile();
            
            showNotification('Profile updated successfully!', 'success');
        } else {
            showNotification(data.message || 'Failed to update profile', 'error');
        }
    } catch (error) {
        console.error('Update error:', error);
        showNotification('Error updating profile. Please try again.', 'error');
    }
}

function updateUserInfoInUI(user) {
    const fullName = `${user.firstName} ${user.lastName}`.trim();
    const initials = user.firstName.charAt(0).toUpperCase() + (user.lastName ? user.lastName.charAt(0).toUpperCase() : '');
    
    // Update header if elements exist
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const dropdownName = document.getElementById('dropdownName');
    const dropdownEmail = document.getElementById('dropdownEmail');
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    
    if (userName) userName.textContent = user.firstName;
    if (userAvatar) userAvatar.textContent = initials;
    if (dropdownName) dropdownName.textContent = fullName;
    if (dropdownEmail) dropdownEmail.textContent = user.email;
    if (dropdownAvatar) dropdownAvatar.textContent = initials;
}


// ==================== ADDRESS MANAGEMENT ====================

// Open Address Management Modal
function showSavedAddresses() {
    closeSettingsModal();
    const modal = document.getElementById('addressManagementModal');
    if (modal) {
        modal.classList.add('show');
        loadAddresses();
    }
}

function showAddNewAddress() {
    closeSettingsModal();
    const modal = document.getElementById('addressManagementModal');
    if (modal) {
        modal.classList.add('show');
        showAddAddressForm();
    }
}

function closeAddressModal() {
    const modal = document.getElementById('addressManagementModal');
    if (modal) modal.classList.remove('show');
    cancelAddressForm();
}

// Load saved addresses
async function loadAddresses() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5002/api/addresses', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        const addressList = document.getElementById('addressList');
        
        if (!addressList) return;
        
        if (!result.success || result.data.length === 0) {
            addressList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No saved addresses yet</p>';
            return;
        }
        
        const addresses = result.data;
        addressList.innerHTML = addresses.map((addr) => `
            <div class="address-card ${addr.isDefault ? 'default' : ''}">
                <div class="address-card-header">
                    <div class="address-card-name">${addr.fullName}</div>
                    ${addr.isDefault ? '<span class="address-default-badge">Default</span>' : ''}
                </div>
                <div class="address-card-details">
                    <div><i class="fas fa-phone"></i> ${addr.mobile}</div>
                    <div><i class="fas fa-map-marker-alt"></i> ${addr.house}, ${addr.street}</div>
                    <div>${addr.city}, ${addr.state} - ${addr.pincode}</div>
                    <div>${addr.country}</div>
                </div>
                <div class="address-card-actions">
                    <button class="address-btn address-btn-edit" onclick="editAddress(${addr.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    ${!addr.isDefault ? `
                    <button class="address-btn address-btn-default" onclick="setDefaultAddress(${addr.id})">
                        <i class="fas fa-star"></i> Set Default
                    </button>
                    ` : ''}
                    <button class="address-btn address-btn-delete" onclick="deleteAddress(${addr.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Load addresses error:', error);
        showNotification('Failed to load addresses', 'error');
    }
}

// Show add address form
function showAddAddressForm() {
    document.getElementById('addressListSection').style.display = 'none';
    document.getElementById('addressFormSection').style.display = 'block';
    document.getElementById('addressFormTitle').textContent = 'Add New Address';
    clearAddressForm();
}

// Clear address form
function clearAddressForm() {
    document.getElementById('addressId').value = '';
    document.getElementById('addressFullName').value = '';
    document.getElementById('addressMobile').value = '';
    document.getElementById('addressHouse').value = '';
    document.getElementById('addressStreet').value = '';
    document.getElementById('addressCity').value = '';
    document.getElementById('addressState').value = '';
    document.getElementById('addressPincode').value = '';
    document.getElementById('addressCountry').value = '';
    document.getElementById('addressDefault').checked = false;
}

// Cancel address form
function cancelAddressForm() {
    document.getElementById('addressFormSection').style.display = 'none';
    document.getElementById('addressListSection').style.display = 'block';
    clearAddressForm();
}

// Save address
async function saveAddress() {
    const fullName = document.getElementById('addressFullName').value.trim();
    const mobile = document.getElementById('addressMobile').value.trim();
    const house = document.getElementById('addressHouse').value.trim();
    const street = document.getElementById('addressStreet').value.trim();
    const city = document.getElementById('addressCity').value.trim();
    const state = document.getElementById('addressState').value.trim();
    const pincode = document.getElementById('addressPincode').value.trim();
    const country = document.getElementById('addressCountry').value.trim();
    const isDefault = document.getElementById('addressDefault').checked;
    const addressId = document.getElementById('addressId').value;
    
    // Validation
    if (!fullName || !mobile || !house || !street || !city || !state || !pincode || !country) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    // Mobile number validation - must be exactly 10 digits
    if (!/^\d{10}$/.test(mobile)) {
        showNotification('Mobile number must be exactly 10 digits', 'error');
        return;
    }
    
    const addressData = {
        fullName,
        mobile,
        house,
        street,
        city,
        state,
        pincode,
        country,
        isDefault
    };
    
    try {
        const token = localStorage.getItem('token');
        const url = addressId 
            ? `http://localhost:5002/api/addresses/${addressId}`
            : 'http://localhost:5002/api/addresses';
        const method = addressId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addressData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(addressId ? 'Address updated successfully!' : 'Address added successfully!', 'success');
            cancelAddressForm();
            loadAddresses();
        } else {
            showNotification(result.message || 'Failed to save address', 'error');
        }
    } catch (error) {
        console.error('Save address error:', error);
        showNotification('Error saving address. Please try again.', 'error');
    }
}

// Edit address
async function editAddress(addressId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5002/api/addresses', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        if (!result.success) {
            showNotification('Failed to load address', 'error');
            return;
        }
        
        const addr = result.data.find(a => a.id === addressId);
        if (!addr) {
            showNotification('Address not found', 'error');
            return;
        }
        
        document.getElementById('addressId').value = addr.id;
        document.getElementById('addressFullName').value = addr.fullName;
        document.getElementById('addressMobile').value = addr.mobile;
        document.getElementById('addressHouse').value = addr.house;
        document.getElementById('addressStreet').value = addr.street;
        document.getElementById('addressCity').value = addr.city;
        document.getElementById('addressState').value = addr.state;
        document.getElementById('addressPincode').value = addr.pincode;
        document.getElementById('addressCountry').value = addr.country;
        document.getElementById('addressDefault').checked = addr.isDefault === 1;
        
        document.getElementById('addressFormTitle').textContent = 'Edit Address';
        document.getElementById('addressListSection').style.display = 'none';
        document.getElementById('addressFormSection').style.display = 'block';
    } catch (error) {
        console.error('Edit address error:', error);
        showNotification('Error loading address', 'error');
    }
}

// Delete address
async function deleteAddress(addressId) {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5002/api/addresses/${addressId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Address deleted successfully!', 'success');
            loadAddresses();
        } else {
            showNotification(result.message || 'Failed to delete address', 'error');
        }
    } catch (error) {
        console.error('Delete address error:', error);
        showNotification('Error deleting address', 'error');
    }
}

// Set default address
async function setDefaultAddress(addressId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5002/api/addresses/${addressId}/default`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Default address updated!', 'success');
            loadAddresses();
        } else {
            showNotification(result.message || 'Failed to set default address', 'error');
        }
    } catch (error) {
        console.error('Set default address error:', error);
        showNotification('Error setting default address', 'error');
    }
}

// ==================== ORDERS & SHOPPING ====================

// Show My Orders
function showMyOrders() {
    closeSettingsModal();
    const modal = document.getElementById('ordersModal');
    if (modal) {
        document.getElementById('ordersModalTitle').textContent = 'My Orders';
        modal.classList.add('show');
        loadOrders();
    }
}

// Show Order Tracking
function showOrderTracking() {
    closeSettingsModal();
    const modal = document.getElementById('ordersModal');
    if (modal) {
        document.getElementById('ordersModalTitle').textContent = 'Order Tracking';
        modal.classList.add('show');
        loadOrderTracking();
    }
}

// Show Order History
function showOrderHistory() {
    closeSettingsModal();
    const modal = document.getElementById('ordersModal');
    if (modal) {
        document.getElementById('ordersModalTitle').textContent = 'Order History';
        modal.classList.add('show');
        loadOrderHistory();
    }
}

// Show Returns & Refunds
function showReturnsRefunds() {
    closeSettingsModal();
    const modal = document.getElementById('ordersModal');
    if (modal) {
        document.getElementById('ordersModalTitle').textContent = 'Returns & Refunds';
        modal.classList.add('show');
        loadReturnsRefunds();
    }
}

function closeOrdersModal() {
    const modal = document.getElementById('ordersModal');
    if (modal) modal.classList.remove('show');
}

// Load orders
function loadOrders() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user.email || 'guest';
    const orders = JSON.parse(localStorage.getItem(`orders_${userId}`) || '[]');
    const ordersContent = document.getElementById('ordersContent');
    
    if (!ordersContent) return;
    
    if (orders.length === 0) {
        ordersContent.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No orders yet</p>';
        return;
    }
    
    ordersContent.innerHTML = orders.map((order, index) => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">Order #${order.id}</div>
                <div class="order-status ${order.status}">${order.status.toUpperCase()}</div>
            </div>
            <div class="order-details">
                <div><i class="fas fa-calendar"></i> Order Date: ${order.date}</div>
                <div><i class="fas fa-dollar-sign"></i> Total: $${order.total.toFixed(2)}</div>
                <div><i class="fas fa-map-marker-alt"></i> Delivery Address: ${order.address}</div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}" class="order-item-image">
                        <div class="order-item-info">
                            <div class="order-item-name">${item.name}</div>
                            <div class="order-item-details">Qty: ${item.quantity} | Price: $${item.price.toFixed(2)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-actions">
                <button class="order-btn order-btn-primary" onclick="trackOrder('${order.id}')">
                    <i class="fas fa-truck"></i> Track Order
                </button>
                ${order.status === 'delivered' ? `
                <button class="order-btn order-btn-secondary" onclick="returnOrder('${order.id}')">
                    <i class="fas fa-undo"></i> Return
                </button>
                ` : ''}
                ${order.status === 'pending' || order.status === 'processing' ? `
                <button class="order-btn order-btn-secondary" onclick="cancelOrder('${order.id}')">
                    <i class="fas fa-times"></i> Cancel
                </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Load order tracking
function loadOrderTracking() {
    const ordersContent = document.getElementById('ordersContent');
    if (!ordersContent) return;
    
    ordersContent.innerHTML = `
        <div style="padding: 20px;">
            <div class="form-group">
                <label for="trackingOrderId">Enter Order ID</label>
                <input type="text" id="trackingOrderId" class="settings-input" placeholder="Enter order ID">
            </div>
            <button class="settings-btn settings-btn-primary" onclick="searchOrderTracking()">
                <i class="fas fa-search"></i> Track Order
            </button>
            <div id="trackingResult" style="margin-top: 20px;"></div>
        </div>
    `;
}

// Search order tracking
function searchOrderTracking() {
    const orderId = document.getElementById('trackingOrderId').value.trim();
    if (!orderId) {
        showNotification('Please enter an order ID', 'error');
        return;
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user.email || 'guest';
    const orders = JSON.parse(localStorage.getItem(`orders_${userId}`) || '[]');
    const order = orders.find(o => o.id === orderId);
    
    const trackingResult = document.getElementById('trackingResult');
    if (!order) {
        trackingResult.innerHTML = '<p style="color: #dc3545; text-align: center;">Order not found</p>';
        return;
    }
    
    trackingResult.innerHTML = `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">Order #${order.id}</div>
                <div class="order-status ${order.status}">${order.status.toUpperCase()}</div>
            </div>
            <div class="order-details">
                <div><i class="fas fa-calendar"></i> Order Date: ${order.date}</div>
                <div><i class="fas fa-truck"></i> Estimated Delivery: ${order.estimatedDelivery || 'TBD'}</div>
            </div>
        </div>
    `;
}

// Load order history
function loadOrderHistory() {
    loadOrders(); // Same as orders but could filter by date range
}

// Load returns & refunds
function loadReturnsRefunds() {
    const ordersContent = document.getElementById('ordersContent');
    if (!ordersContent) return;
    
    ordersContent.innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <i class="fas fa-undo" style="font-size: 3rem; color: var(--primary); margin-bottom: 20px;"></i>
            <h3>Returns & Refunds</h3>
            <p style="color: var(--text-secondary); margin: 20px 0;">
                You can return delivered items within 30 days of delivery.
            </p>
            <p style="color: var(--text-secondary);">
                Refunds will be processed within 5-7 business days after we receive the returned item.
            </p>
            <button class="settings-btn settings-btn-primary" onclick="showMyOrders()" style="margin-top: 20px;">
                <i class="fas fa-shopping-bag"></i> View My Orders
            </button>
        </div>
    `;
}

// Track order
function trackOrder(orderId) {
    showOrderTracking();
    setTimeout(() => {
        document.getElementById('trackingOrderId').value = orderId;
        searchOrderTracking();
    }, 100);
}

// Cancel order
function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user.email || 'guest';
    const orders = JSON.parse(localStorage.getItem(`orders_${userId}`) || '[]');
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = 'cancelled';
        localStorage.setItem(`orders_${userId}`, JSON.stringify(orders));
        showNotification('Order cancelled successfully!', 'success');
        loadOrders();
    }
}

// Return order
function returnOrder(orderId) {
    if (!confirm('Are you sure you want to return this order?')) return;
    
    showNotification('Return request submitted! We will contact you soon.', 'success');
}


// ==================== PAYMENT OPTIONS ====================

// Show Saved Cards
function showSavedCards() {
    closeSettingsModal();
    const modal = document.getElementById('paymentModal');
    if (modal) {
        document.getElementById('paymentModalTitle').textContent = 'Payment Options';
        modal.classList.add('show');
        document.getElementById('paymentMethodSelection').style.display = 'block';
        document.getElementById('paymentListSection').style.display = 'none';
        document.getElementById('paymentFormSection').style.display = 'none';
    }
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.classList.remove('show');
    document.getElementById('paymentMethodSelection').style.display = 'block';
    document.getElementById('paymentListSection').style.display = 'none';
    document.getElementById('paymentFormSection').style.display = 'none';
}

// Show payment method form
function showPaymentMethodForm(type) {
    document.getElementById('paymentMethodSelection').style.display = 'none';
    document.getElementById('paymentFormSection').style.display = 'block';
    document.getElementById('paymentType').value = type;
    
    // Hide all forms
    const forms = ['cardForm', 'upiForm', 'googlepayForm', 'phonepeForm', 'paytmForm', 'amazonpayForm', 'netbankingForm', 'codForm'];
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) form.style.display = 'none';
    });
    
    // Show appropriate form and set title
    const titles = {
        'card': 'Add Credit/Debit Card',
        'upi': 'Add UPI ID',
        'googlepay': 'Add Google Pay',
        'phonepe': 'Add PhonePe',
        'paytm': 'Add Paytm',
        'amazonpay': 'Add Amazon Pay',
        'netbanking': 'Add Net Banking',
        'cod': 'Cash on Delivery'
    };
    
    document.getElementById('paymentFormTitle').textContent = titles[type] || 'Add Payment Method';
    const formToShow = document.getElementById(type + 'Form');
    if (formToShow) formToShow.style.display = 'block';
    
    clearPaymentForm();
}

// Back to payment selection
function backToPaymentSelection() {
    document.getElementById('paymentFormSection').style.display = 'none';
    document.getElementById('paymentMethodSelection').style.display = 'block';
    clearPaymentForm();
}

// Clear payment form
function clearPaymentForm() {
    // Card fields
    const cardNumber = document.getElementById('cardNumber');
    const cardName = document.getElementById('cardName');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCVV = document.getElementById('cardCVV');
    if (cardNumber) cardNumber.value = '';
    if (cardName) cardName.value = '';
    if (cardExpiry) cardExpiry.value = '';
    if (cardCVV) cardCVV.value = '';
    
    // UPI fields
    const upiId = document.getElementById('upiId');
    const upiName = document.getElementById('upiName');
    if (upiId) upiId.value = '';
    if (upiName) upiName.value = '';
    
    // Google Pay fields
    const googlepayNumber = document.getElementById('googlepayNumber');
    const googlepayName = document.getElementById('googlepayName');
    if (googlepayNumber) googlepayNumber.value = '';
    if (googlepayName) googlepayName.value = '';
    
    // PhonePe fields
    const phonepeNumber = document.getElementById('phonepeNumber');
    const phonepeName = document.getElementById('phonepeName');
    if (phonepeNumber) phonepeNumber.value = '';
    if (phonepeName) phonepeName.value = '';
    
    // Paytm fields
    const paytmNumber = document.getElementById('paytmNumber');
    const paytmName = document.getElementById('paytmName');
    if (paytmNumber) paytmNumber.value = '';
    if (paytmName) paytmName.value = '';
    
    // Amazon Pay fields
    const amazonpayEmail = document.getElementById('amazonpayEmail');
    const amazonpayName = document.getElementById('amazonpayName');
    if (amazonpayEmail) amazonpayEmail.value = '';
    if (amazonpayName) amazonpayName.value = '';
    
    // Net Banking fields
    const bankName = document.getElementById('bankName');
    const accountNumber = document.getElementById('accountNumber');
    const ifscCode = document.getElementById('ifscCode');
    const accountHolderName = document.getElementById('accountHolderName');
    if (bankName) bankName.value = '';
    if (accountNumber) accountNumber.value = '';
    if (ifscCode) ifscCode.value = '';
    if (accountHolderName) accountHolderName.value = '';
    
    // COD fields
    const codName = document.getElementById('codName');
    const codMobile = document.getElementById('codMobile');
    if (codName) codName.value = '';
    if (codMobile) codMobile.value = '';
    
    const paymentDefault = document.getElementById('paymentDefault');
    if (paymentDefault) paymentDefault.checked = false;
}

// Save payment method
function savePaymentMethod() {
    const type = document.getElementById('paymentType').value;
    const isDefault = document.getElementById('paymentDefault').checked;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user.email || 'guest';
    const payments = JSON.parse(localStorage.getItem(`paymentMethods_${userId}`) || '[]');
    
    let newPayment = { 
        type, 
        isDefault: isDefault || payments.length === 0,
        createdAt: new Date().toISOString()
    };
    
    // Validate and collect data based on payment type
    if (type === 'card') {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const cardName = document.getElementById('cardName').value.trim();
        const cardExpiry = document.getElementById('cardExpiry').value.trim();
        const cardCVV = document.getElementById('cardCVV').value.trim();
        
        if (!cardNumber || !cardName || !cardExpiry || !cardCVV) {
            showNotification('Please fill all card details', 'error');
            return;
        }
        
        newPayment.name = cardName;
        newPayment.lastFour = cardNumber.slice(-4);
        newPayment.expiry = cardExpiry;
        newPayment.displayName = `Card ending in ${newPayment.lastFour}`;
        
    } else if (type === 'upi') {
        const upiId = document.getElementById('upiId').value.trim();
        const upiName = document.getElementById('upiName').value.trim();
        
        if (!upiId || !upiName) {
            showNotification('Please fill all UPI details', 'error');
            return;
        }
        
        newPayment.name = upiName;
        newPayment.upiId = upiId;
        newPayment.displayName = upiId;
        
    } else if (type === 'googlepay') {
        const googlepayNumber = document.getElementById('googlepayNumber').value.trim();
        const googlepayName = document.getElementById('googlepayName').value.trim();
        
        if (!googlepayNumber || !googlepayName) {
            showNotification('Please fill all Google Pay details', 'error');
            return;
        }
        
        newPayment.name = googlepayName;
        newPayment.identifier = googlepayNumber;
        newPayment.displayName = `Google Pay - ${googlepayNumber}`;
        
    } else if (type === 'phonepe') {
        const phonepeNumber = document.getElementById('phonepeNumber').value.trim();
        const phonepeName = document.getElementById('phonepeName').value.trim();
        
        if (!phonepeNumber || !phonepeName) {
            showNotification('Please fill all PhonePe details', 'error');
            return;
        }
        
        if (!/^\d{10}$/.test(phonepeNumber)) {
            showNotification('Mobile number must be exactly 10 digits', 'error');
            return;
        }
        
        newPayment.name = phonepeName;
        newPayment.mobile = phonepeNumber;
        newPayment.displayName = `PhonePe - ${phonepeNumber}`;
        
    } else if (type === 'paytm') {
        const paytmNumber = document.getElementById('paytmNumber').value.trim();
        const paytmName = document.getElementById('paytmName').value.trim();
        
        if (!paytmNumber || !paytmName) {
            showNotification('Please fill all Paytm details', 'error');
            return;
        }
        
        if (!/^\d{10}$/.test(paytmNumber)) {
            showNotification('Mobile number must be exactly 10 digits', 'error');
            return;
        }
        
        newPayment.name = paytmName;
        newPayment.mobile = paytmNumber;
        newPayment.displayName = `Paytm - ${paytmNumber}`;
        
    } else if (type === 'amazonpay') {
        const amazonpayEmail = document.getElementById('amazonpayEmail').value.trim();
        const amazonpayName = document.getElementById('amazonpayName').value.trim();
        
        if (!amazonpayEmail || !amazonpayName) {
            showNotification('Please fill all Amazon Pay details', 'error');
            return;
        }
        
        newPayment.name = amazonpayName;
        newPayment.email = amazonpayEmail;
        newPayment.displayName = `Amazon Pay - ${amazonpayEmail}`;
        
    } else if (type === 'netbanking') {
        const bankName = document.getElementById('bankName').value;
        const accountNumber = document.getElementById('accountNumber').value.trim();
        const ifscCode = document.getElementById('ifscCode').value.trim();
        const accountHolderName = document.getElementById('accountHolderName').value.trim();
        
        if (!bankName || !accountNumber || !ifscCode || !accountHolderName) {
            showNotification('Please fill all bank details', 'error');
            return;
        }
        
        newPayment.name = accountHolderName;
        newPayment.bankName = bankName;
        newPayment.lastFour = accountNumber.slice(-4);
        newPayment.ifsc = ifscCode;
        newPayment.displayName = `${bankName} - ••••${newPayment.lastFour}`;
        
    } else if (type === 'cod') {
        const codName = document.getElementById('codName').value.trim();
        const codMobile = document.getElementById('codMobile').value.trim();
        
        if (!codName || !codMobile) {
            showNotification('Please fill all details', 'error');
            return;
        }
        
        if (!/^\d{10}$/.test(codMobile)) {
            showNotification('Mobile number must be exactly 10 digits', 'error');
            return;
        }
        
        newPayment.name = codName;
        newPayment.mobile = codMobile;
        newPayment.displayName = `Cash on Delivery - ${codMobile}`;
    }
    
    // If setting as default, unset all others
    if (newPayment.isDefault) {
        payments.forEach(p => p.isDefault = false);
    }
    
    payments.push(newPayment);
    localStorage.setItem(`paymentMethods_${userId}`, JSON.stringify(payments));
    
    showNotification('Payment method added successfully!', 'success');
    backToPaymentSelection();
}

// Cancel payment form
function cancelPaymentForm() {
    backToPaymentSelection();
}

// Delete payment method
function deletePaymentMethod(index) {
    if (!confirm('Are you sure you want to delete this payment method?')) return;
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user.email || 'guest';
    const payments = JSON.parse(localStorage.getItem(`paymentMethods_${userId}`) || '[]');
    const wasDefault = payments[index].isDefault;
    payments.splice(index, 1);
    
    // If deleted payment was default and there are other payments, make first one default
    if (wasDefault && payments.length > 0) {
        payments[0].isDefault = true;
    }
    
    localStorage.setItem(`paymentMethods_${userId}`, JSON.stringify(payments));
    showNotification('Payment method deleted successfully!', 'success');
    backToPaymentSelection();
}

// Set default payment
function setDefaultPayment(index) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user.email || 'guest';
    const payments = JSON.parse(localStorage.getItem(`paymentMethods_${userId}`) || '[]');
    payments.forEach((p, i) => p.isDefault = i === index);
    localStorage.setItem(`paymentMethods_${userId}`, JSON.stringify(payments));
    showNotification('Default payment method updated!', 'success');
}

// Load billing information
async function loadBillingInfo() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5002/api/addresses', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        const addresses = result.success ? result.data : [];
        const defaultAddress = addresses.find(addr => addr.isDefault === 1) || addresses[0];
        
        const paymentContent = document.getElementById('paymentContent');
        if (!paymentContent) return;
    
    paymentContent.innerHTML = `
        <div class="billing-info-card">
            <h3 style="margin-bottom: 20px; color: var(--text-primary);">
                <i class="fas fa-user"></i> Personal Information
            </h3>
            <div class="billing-info-row">
                <span class="billing-info-label">Full Name</span>
                <span class="billing-info-value">${user.firstName || ''} ${user.lastName || ''}</span>
            </div>
            <div class="billing-info-row">
                <span class="billing-info-label">Email</span>
                <span class="billing-info-value">${user.email || 'Not provided'}</span>
            </div>
            <div class="billing-info-row">
                <span class="billing-info-label">Phone</span>
                <span class="billing-info-value">${user.mobile || 'Not provided'}</span>
            </div>
        </div>
        
        ${defaultAddress ? `
        <div class="billing-info-card">
            <h3 style="margin-bottom: 20px; color: var(--text-primary);">
                <i class="fas fa-map-marker-alt"></i> Billing Address
            </h3>
            <div class="billing-info-row">
                <span class="billing-info-label">Address</span>
                <span class="billing-info-value">${defaultAddress.house}, ${defaultAddress.street}</span>
            </div>
            <div class="billing-info-row">
                <span class="billing-info-label">City</span>
                <span class="billing-info-value">${defaultAddress.city}</span>
            </div>
            <div class="billing-info-row">
                <span class="billing-info-label">State</span>
                <span class="billing-info-value">${defaultAddress.state}</span>
            </div>
            <div class="billing-info-row">
                <span class="billing-info-label">Pincode</span>
                <span class="billing-info-value">${defaultAddress.pincode}</span>
            </div>
            <div class="billing-info-row">
                <span class="billing-info-label">Country</span>
                <span class="billing-info-value">${defaultAddress.country}</span>
            </div>
        </div>
        ` : '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No billing address set</p>'}
        
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button class="settings-btn settings-btn-primary" onclick="openSettings(event)">
                <i class="fas fa-edit"></i> Edit Profile
            </button>
            <button class="settings-btn settings-btn-primary" onclick="showSavedAddresses()">
                <i class="fas fa-map-marker-alt"></i> Manage Addresses
            </button>
        </div>
    `;
    } catch (error) {
        console.error('Load billing info error:', error);
        showNotification('Failed to load billing information', 'error');
    }
}

// Format card number input
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
});


// ==================== MOBILE NUMBER VALIDATION ====================
// Add real-time validation for mobile number input in address form
document.addEventListener('DOMContentLoaded', function() {
    const mobileInput = document.getElementById('addressMobile');
    if (mobileInput) {
        mobileInput.addEventListener('input', function(e) {
            // Remove any non-digit characters
            let value = e.target.value.replace(/\D/g, '');
            // Limit to 10 digits
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            e.target.value = value;
        });
        
        // Prevent paste of non-numeric content
        mobileInput.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const numericText = pastedText.replace(/\D/g, '').slice(0, 10);
            e.target.value = numericText;
        });
    }
});


// ============================================
// TRY-ON HISTORY FUNCTIONS
// ============================================

// Show Try-On History
function showTryOnHistory(event) {
    if (event) event.preventDefault();
    closeSettingsModal();
    const modal = document.getElementById('tryOnHistoryModal');
    if (modal) {
        modal.classList.add('show');
        loadTryOnHistory();
    }
}

// Close Try-On History Modal
function closeTryOnHistoryModal() {
    const modal = document.getElementById('tryOnHistoryModal');
    if (modal) modal.classList.remove('show');
}

// Load Try-On History
function loadTryOnHistory() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user.email || 'guest';
    const historyKey = `tryon_history_${userId}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    const historyContent = document.getElementById('tryOnHistoryContent');
    
    if (history.length === 0) {
        historyContent.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px; grid-column: 1/-1;">No try-on history yet</p>';
        return;
    }
    
    historyContent.innerHTML = history.map((item, index) => `
        <div style="border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.3s ease;" onclick="viewTryOnHistoryItem(${index})">
            <div style="width: 100%; height: 200px; background: var(--bg-secondary); overflow: hidden;">
                <img src="${item.resultImage}" alt="Try-On ${index + 1}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="padding: 12px; background: var(--card-bg);">
                <p style="margin: 0; font-size: 0.9rem; color: var(--text-primary); font-weight: 600;">
                    ${item.clothName || 'Try-On Result'}
                </p>
                <p style="margin: 5px 0 0 0; font-size: 0.8rem; color: var(--text-secondary);">
                    ${new Date(item.date).toLocaleDateString()}
                </p>
            </div>
        </div>
    `).join('');
}

// View Try-On History Item
function viewTryOnHistoryItem(index) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user.email || 'guest';
    const historyKey = `tryon_history_${userId}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    const item = history[index];
    
    if (!item) return;
    
    // Create a modal to view the full image
    const viewModal = document.createElement('div');
    viewModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    viewModal.innerHTML = `
        <div style="background: var(--card-bg); border-radius: 16px; padding: 20px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: var(--text-primary);">Try-On Result</h3>
                <button onclick="this.closest('div').parentElement.remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary);">&times;</button>
            </div>
            <img src="${item.resultImage}" alt="Try-On Result" style="width: 100%; border-radius: 12px; margin-bottom: 20px;">
            <div style="background: var(--bg-secondary); padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; color: var(--text-secondary); font-size: 0.9rem;">
                    <strong>Cloth:</strong> ${item.clothName || 'Custom Cloth'}
                </p>
                <p style="margin: 0 0 10px 0; color: var(--text-secondary); font-size: 0.9rem;">
                    <strong>Date:</strong> ${new Date(item.date).toLocaleString()}
                </p>
                <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">
                    <strong>Category:</strong> ${item.category || 'N/A'}
                </p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="downloadTryOnImage('${item.resultImage}', '${item.clothName || 'tryon'}')" style="flex: 1; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-download"></i> Download
                </button>
                <button onclick="deleteTryOnHistoryItem(${index})" style="flex: 1; padding: 12px; background: #f43f5e; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(viewModal);
}

// Delete Try-On History Item
function deleteTryOnHistoryItem(index) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user.email || 'guest';
    const historyKey = `tryon_history_${userId}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    
    history.splice(index, 1);
    localStorage.setItem(historyKey, JSON.stringify(history));
    
    // Close the view modal
    document.querySelectorAll('div[style*="position: fixed"]').forEach(el => {
        if (el.style.background && el.style.background.includes('rgba(0, 0, 0, 0.8)')) {
            el.remove();
        }
    });
    
    // Reload history
    loadTryOnHistory();
    showNotification('Try-on result deleted successfully!');
}

// Download Try-On Image
function downloadTryOnImage(imageUrl, clothName) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${clothName || 'tryon'}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Image downloaded successfully!');
}

// Save Try-On to History
function saveTryOnToHistory(resultImageUrl, clothName, category) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user.email || 'guest';
    const historyKey = `tryon_history_${userId}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    
    // Add new try-on to history
    const newEntry = {
        resultImage: resultImageUrl,
        clothName: clothName,
        category: category,
        date: new Date().toISOString()
    };
    
    history.unshift(newEntry); // Add to beginning
    
    // Keep only last 50 try-ons
    if (history.length > 50) {
        history.pop();
    }
    
    localStorage.setItem(historyKey, JSON.stringify(history));
}
