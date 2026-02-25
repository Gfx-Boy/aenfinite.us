#!/usr/bin/env node
/**
 * generate-languages.js
 *
 * Creates localized versions of every page for 10 Tier-1 languages.
 * Each language gets its own folder under app/ (e.g. app/es/, app/fr/) mirroring
 * the English page structure.
 *
 * What gets translated per page:
 *  - Metadata (title, description, keywords, OG, Twitter)
 *  - Key heading strings in the HTML content
 *  - Navigation / UI strings embedded in HTML
 *  - Schema descriptions
 *  - <html lang=".."> via a lang-aware layout
 *
 * Usage:
 *   node scripts/generate-languages.js          # generate all languages
 *   node scripts/generate-languages.js es       # generate Spanish only
 *   node scripts/generate-languages.js --verify  # verify structure
 */

const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'app');

// ============================================================================
// LANGUAGE CONFIGURATIONS
// ============================================================================

const LANGUAGES = {
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    dir: 'ltr',
    translations: {
      // Site-wide
      'Professional Digital Innovation Agency': 'Agencia Profesional de Innovación Digital',
      'Web Design, Branding & Digital Marketing': 'Diseño Web, Branding y Marketing Digital',
      'digital innovation agency specializing in': 'agencia de innovación digital especializada en',
      'custom web design, brand identity, UI/UX design, digital marketing, e-commerce development, and comprehensive digital transformation solutions': 'diseño web personalizado, identidad de marca, diseño UI/UX, marketing digital, desarrollo de e-commerce y soluciones integrales de transformación digital',
      'Serving businesses across the US and Canada': 'Sirviendo a empresas en los Estados Unidos y Canadá',
      'Award-Winning Digital Innovation Agency': 'Agencia de Innovación Digital Galardonada',
      'Transform your business with Aenfinite': 'Transforma tu negocio con Aenfinite',
      // Navigation
      'Services': 'Servicios',
      'Work': 'Portafolio',
      'Contact': 'Contacto',
      'About': 'Acerca de',
      'Agency': 'Agencia',
      'Blog': 'Blog',
      'Featured Work': 'Trabajo Destacado',
      'Privacy Policy': 'Política de Privacidad',
      'Partner With Us': 'Asóciate con Nosotros',
      // Common headings
      'Our Services': 'Nuestros Servicios',
      'Our Work': 'Nuestro Portafolio',
      'Get in Touch': 'Contáctanos',
      'Contact Us': 'Contáctanos',
      'Let\'s Talk': 'Hablemos',
      'View All': 'Ver Todo',
      'Learn More': 'Saber Más',
      'Read More': 'Leer Más',
      'See More': 'Ver Más',
      'show more': 'ver más',
      'All Rights Reserved': 'Todos los Derechos Reservados',
      // Service names
      'Web Design': 'Diseño Web',
      'Branding': 'Branding',
      'Digital Marketing': 'Marketing Digital',
      'App Development': 'Desarrollo de Aplicaciones',
      'E-Commerce Websites': 'Sitios Web de E-Commerce',
      'Custom Web Development': 'Desarrollo Web Personalizado',
      'Graphic Design': 'Diseño Gráfico',
      'Logo Design': 'Diseño de Logotipos',
      'SEO Services': 'Servicios SEO',
      'Search Engine Optimization': 'Optimización para Motores de Búsqueda',
      'Social Media Marketing': 'Marketing en Redes Sociales',
      'UI/UX Design': 'Diseño UI/UX',
      'Packaging Design': 'Diseño de Empaques',
      'Paid Ads': 'Publicidad Pagada',
      'Pay Per Click': 'Pago por Clic',
      'Conference Branding': 'Branding para Conferencias',
      'Trade Show Booth Design': 'Diseño de Stands para Ferias',
      'WordPress Websites': 'Sitios Web WordPress',
      'Software & Platform Development': 'Desarrollo de Software y Plataformas',
      'AI Chatbots & Virtual Assistants': 'Chatbots de IA y Asistentes Virtuales',
      'Workflow and Business Automation': 'Automatización de Flujos de Trabajo y Negocios',
      'Web Design and Branding for Real Estate': 'Diseño Web y Branding para Bienes Raíces',
      // CTAs
      'Get Started': 'Comenzar',
      'Request a Quote': 'Solicitar Cotización',
      'Schedule a Call': 'Agendar una Llamada',
      'Free Consultation': 'Consulta Gratuita',
      'Send Message': 'Enviar Mensaje',
    },
  },

  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    dir: 'ltr',
    translations: {
      'Professional Digital Innovation Agency': 'Agence Professionnelle d\'Innovation Digitale',
      'Web Design, Branding & Digital Marketing': 'Conception Web, Branding et Marketing Digital',
      'digital innovation agency specializing in': 'agence d\'innovation digitale spécialisée dans',
      'custom web design, brand identity, UI/UX design, digital marketing, e-commerce development, and comprehensive digital transformation solutions': 'la conception web sur mesure, l\'identité de marque, le design UI/UX, le marketing digital, le développement e-commerce et les solutions complètes de transformation digitale',
      'Serving businesses across the US and Canada': 'Au service des entreprises aux États-Unis et au Canada',
      'Award-Winning Digital Innovation Agency': 'Agence d\'Innovation Digitale Primée',
      'Transform your business with Aenfinite': 'Transformez votre entreprise avec Aenfinite',
      'Services': 'Services',
      'Work': 'Réalisations',
      'Contact': 'Contact',
      'About': 'À propos',
      'Agency': 'Agence',
      'Blog': 'Blog',
      'Featured Work': 'Réalisations en Vedette',
      'Privacy Policy': 'Politique de Confidentialité',
      'Partner With Us': 'Devenez Partenaire',
      'Our Services': 'Nos Services',
      'Our Work': 'Nos Réalisations',
      'Get in Touch': 'Contactez-nous',
      'Contact Us': 'Contactez-nous',
      'Let\'s Talk': 'Parlons-en',
      'View All': 'Voir Tout',
      'Learn More': 'En Savoir Plus',
      'Read More': 'Lire la Suite',
      'See More': 'Voir Plus',
      'show more': 'voir plus',
      'All Rights Reserved': 'Tous Droits Réservés',
      'Web Design': 'Conception Web',
      'Branding': 'Image de Marque',
      'Digital Marketing': 'Marketing Digital',
      'App Development': 'Développement d\'Applications',
      'E-Commerce Websites': 'Sites E-Commerce',
      'Custom Web Development': 'Développement Web Sur Mesure',
      'Graphic Design': 'Design Graphique',
      'Logo Design': 'Création de Logo',
      'SEO Services': 'Services SEO',
      'Search Engine Optimization': 'Optimisation pour les Moteurs de Recherche',
      'Social Media Marketing': 'Marketing sur les Réseaux Sociaux',
      'UI/UX Design': 'Design UI/UX',
      'Packaging Design': 'Design d\'Emballage',
      'Paid Ads': 'Publicité Payante',
      'Pay Per Click': 'Paiement par Clic',
      'Conference Branding': 'Branding de Conférence',
      'Trade Show Booth Design': 'Conception de Stands d\'Exposition',
      'WordPress Websites': 'Sites WordPress',
      'Software & Platform Development': 'Développement de Logiciels et Plateformes',
      'AI Chatbots & Virtual Assistants': 'Chatbots IA et Assistants Virtuels',
      'Workflow and Business Automation': 'Automatisation des Processus et des Affaires',
      'Web Design and Branding for Real Estate': 'Conception Web et Branding pour l\'Immobilier',
      'Get Started': 'Commencer',
      'Request a Quote': 'Demander un Devis',
      'Schedule a Call': 'Planifier un Appel',
      'Free Consultation': 'Consultation Gratuite',
      'Send Message': 'Envoyer un Message',
    },
  },

  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    dir: 'ltr',
    translations: {
      'Professional Digital Innovation Agency': 'Professionelle Agentur für Digitale Innovation',
      'Web Design, Branding & Digital Marketing': 'Webdesign, Branding und Digitales Marketing',
      'digital innovation agency specializing in': 'Agentur für digitale Innovation, spezialisiert auf',
      'custom web design, brand identity, UI/UX design, digital marketing, e-commerce development, and comprehensive digital transformation solutions': 'individuelles Webdesign, Markenidentität, UI/UX-Design, digitales Marketing, E-Commerce-Entwicklung und umfassende Lösungen für die digitale Transformation',
      'Serving businesses across the US and Canada': 'Wir betreuen Unternehmen in den USA und Kanada',
      'Award-Winning Digital Innovation Agency': 'Preisgekrönte Agentur für Digitale Innovation',
      'Transform your business with Aenfinite': 'Transformieren Sie Ihr Unternehmen mit Aenfinite',
      'Services': 'Dienstleistungen',
      'Work': 'Projekte',
      'Contact': 'Kontakt',
      'About': 'Über uns',
      'Agency': 'Agentur',
      'Blog': 'Blog',
      'Featured Work': 'Ausgewählte Projekte',
      'Privacy Policy': 'Datenschutzerklärung',
      'Partner With Us': 'Partner werden',
      'Our Services': 'Unsere Dienstleistungen',
      'Our Work': 'Unsere Projekte',
      'Get in Touch': 'Kontaktieren Sie uns',
      'Contact Us': 'Kontaktieren Sie uns',
      'Let\'s Talk': 'Lassen Sie uns sprechen',
      'View All': 'Alle anzeigen',
      'Learn More': 'Mehr erfahren',
      'Read More': 'Weiterlesen',
      'See More': 'Mehr sehen',
      'show more': 'mehr anzeigen',
      'All Rights Reserved': 'Alle Rechte vorbehalten',
      'Web Design': 'Webdesign',
      'Branding': 'Markengestaltung',
      'Digital Marketing': 'Digitales Marketing',
      'App Development': 'App-Entwicklung',
      'E-Commerce Websites': 'E-Commerce-Webseiten',
      'Custom Web Development': 'Individuelle Webentwicklung',
      'Graphic Design': 'Grafikdesign',
      'Logo Design': 'Logo-Design',
      'SEO Services': 'SEO-Dienstleistungen',
      'Search Engine Optimization': 'Suchmaschinenoptimierung',
      'Social Media Marketing': 'Social-Media-Marketing',
      'UI/UX Design': 'UI/UX-Design',
      'Packaging Design': 'Verpackungsdesign',
      'Paid Ads': 'Bezahlte Werbung',
      'Pay Per Click': 'Pay-per-Click',
      'Conference Branding': 'Konferenz-Branding',
      'Trade Show Booth Design': 'Messestand-Design',
      'WordPress Websites': 'WordPress-Webseiten',
      'Software & Platform Development': 'Software- und Plattformentwicklung',
      'AI Chatbots & Virtual Assistants': 'KI-Chatbots und Virtuelle Assistenten',
      'Workflow and Business Automation': 'Workflow- und Geschäftsautomatisierung',
      'Web Design and Branding for Real Estate': 'Webdesign und Branding für Immobilien',
      'Get Started': 'Jetzt starten',
      'Request a Quote': 'Angebot anfordern',
      'Schedule a Call': 'Gespräch vereinbaren',
      'Free Consultation': 'Kostenlose Beratung',
      'Send Message': 'Nachricht senden',
    },
  },

  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    dir: 'ltr',
    translations: {
      'Professional Digital Innovation Agency': 'Agenzia Professionale di Innovazione Digitale',
      'Web Design, Branding & Digital Marketing': 'Web Design, Branding e Marketing Digitale',
      'digital innovation agency specializing in': 'agenzia di innovazione digitale specializzata in',
      'custom web design, brand identity, UI/UX design, digital marketing, e-commerce development, and comprehensive digital transformation solutions': 'web design personalizzato, brand identity, UI/UX design, marketing digitale, sviluppo e-commerce e soluzioni complete di trasformazione digitale',
      'Serving businesses across the US and Canada': 'Al servizio delle aziende negli Stati Uniti e in Canada',
      'Award-Winning Digital Innovation Agency': 'Agenzia di Innovazione Digitale Pluripremiata',
      'Transform your business with Aenfinite': 'Trasforma la tua azienda con Aenfinite',
      'Services': 'Servizi',
      'Work': 'Portfolio',
      'Contact': 'Contatto',
      'About': 'Chi Siamo',
      'Agency': 'Agenzia',
      'Blog': 'Blog',
      'Featured Work': 'Lavori in Evidenza',
      'Privacy Policy': 'Informativa sulla Privacy',
      'Partner With Us': 'Collabora con Noi',
      'Our Services': 'I Nostri Servizi',
      'Our Work': 'Il Nostro Portfolio',
      'Get in Touch': 'Contattaci',
      'Contact Us': 'Contattaci',
      'Let\'s Talk': 'Parliamone',
      'View All': 'Vedi Tutto',
      'Learn More': 'Scopri di Più',
      'Read More': 'Leggi di Più',
      'See More': 'Vedi di Più',
      'show more': 'mostra altro',
      'All Rights Reserved': 'Tutti i Diritti Riservati',
      'Web Design': 'Web Design',
      'Branding': 'Branding',
      'Digital Marketing': 'Marketing Digitale',
      'App Development': 'Sviluppo App',
      'E-Commerce Websites': 'Siti E-Commerce',
      'Custom Web Development': 'Sviluppo Web Personalizzato',
      'Graphic Design': 'Design Grafico',
      'Logo Design': 'Design del Logo',
      'SEO Services': 'Servizi SEO',
      'Search Engine Optimization': 'Ottimizzazione per i Motori di Ricerca',
      'Social Media Marketing': 'Marketing sui Social Media',
      'UI/UX Design': 'Design UI/UX',
      'Packaging Design': 'Design del Packaging',
      'Paid Ads': 'Pubblicità a Pagamento',
      'Pay Per Click': 'Pay Per Click',
      'Conference Branding': 'Branding per Conferenze',
      'Trade Show Booth Design': 'Design di Stand Fieristici',
      'WordPress Websites': 'Siti WordPress',
      'Software & Platform Development': 'Sviluppo Software e Piattaforme',
      'AI Chatbots & Virtual Assistants': 'Chatbot IA e Assistenti Virtuali',
      'Workflow and Business Automation': 'Automazione dei Processi Aziendali',
      'Web Design and Branding for Real Estate': 'Web Design e Branding per il Settore Immobiliare',
      'Get Started': 'Inizia Ora',
      'Request a Quote': 'Richiedi un Preventivo',
      'Schedule a Call': 'Prenota una Chiamata',
      'Free Consultation': 'Consulenza Gratuita',
      'Send Message': 'Invia Messaggio',
    },
  },

  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    translations: {
      'Professional Digital Innovation Agency': 'وكالة ابتكار رقمي احترافية',
      'Web Design, Branding & Digital Marketing': 'تصميم المواقع، العلامات التجارية والتسويق الرقمي',
      'digital innovation agency specializing in': 'وكالة ابتكار رقمي متخصصة في',
      'custom web design, brand identity, UI/UX design, digital marketing, e-commerce development, and comprehensive digital transformation solutions': 'تصميم مواقع مخصصة، هوية العلامة التجارية، تصميم واجهة المستخدم، التسويق الرقمي، تطوير التجارة الإلكترونية وحلول التحول الرقمي الشاملة',
      'Serving businesses across the US and Canada': 'نخدم الشركات في جميع أنحاء الولايات المتحدة وكندا',
      'Award-Winning Digital Innovation Agency': 'وكالة ابتكار رقمي حائزة على جوائز',
      'Transform your business with Aenfinite': 'حوّل عملك مع Aenfinite',
      'Services': 'الخدمات',
      'Work': 'الأعمال',
      'Contact': 'اتصل بنا',
      'About': 'من نحن',
      'Agency': 'الوكالة',
      'Blog': 'المدونة',
      'Featured Work': 'أعمال مميزة',
      'Privacy Policy': 'سياسة الخصوصية',
      'Partner With Us': 'كن شريكاً',
      'Our Services': 'خدماتنا',
      'Our Work': 'أعمالنا',
      'Get in Touch': 'تواصل معنا',
      'Contact Us': 'اتصل بنا',
      'Let\'s Talk': 'لنتحدث',
      'View All': 'عرض الكل',
      'Learn More': 'اعرف المزيد',
      'Read More': 'اقرأ المزيد',
      'See More': 'شاهد المزيد',
      'show more': 'عرض المزيد',
      'All Rights Reserved': 'جميع الحقوق محفوظة',
      'Web Design': 'تصميم المواقع',
      'Branding': 'العلامات التجارية',
      'Digital Marketing': 'التسويق الرقمي',
      'App Development': 'تطوير التطبيقات',
      'E-Commerce Websites': 'مواقع التجارة الإلكترونية',
      'Custom Web Development': 'تطوير مواقع مخصصة',
      'Graphic Design': 'التصميم الجرافيكي',
      'Logo Design': 'تصميم الشعارات',
      'SEO Services': 'خدمات تحسين محركات البحث',
      'Search Engine Optimization': 'تحسين محركات البحث',
      'Social Media Marketing': 'التسويق عبر وسائل التواصل الاجتماعي',
      'UI/UX Design': 'تصميم واجهة وتجربة المستخدم',
      'Packaging Design': 'تصميم التغليف',
      'Paid Ads': 'الإعلانات المدفوعة',
      'Pay Per Click': 'الدفع لكل نقرة',
      'Conference Branding': 'العلامة التجارية للمؤتمرات',
      'Trade Show Booth Design': 'تصميم أجنحة المعارض',
      'WordPress Websites': 'مواقع ووردبريس',
      'Software & Platform Development': 'تطوير البرمجيات والمنصات',
      'AI Chatbots & Virtual Assistants': 'روبوتات الدردشة الذكية والمساعدون الافتراضيون',
      'Workflow and Business Automation': 'أتمتة سير العمل والأعمال',
      'Web Design and Branding for Real Estate': 'تصميم المواقع والعلامات التجارية للعقارات',
      'Get Started': 'ابدأ الآن',
      'Request a Quote': 'اطلب عرض سعر',
      'Schedule a Call': 'حدد موعد مكالمة',
      'Free Consultation': 'استشارة مجانية',
      'Send Message': 'إرسال رسالة',
    },
  },

  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    dir: 'ltr',
    translations: {
      'Professional Digital Innovation Agency': 'Agência Profissional de Inovação Digital',
      'Web Design, Branding & Digital Marketing': 'Web Design, Branding e Marketing Digital',
      'digital innovation agency specializing in': 'agência de inovação digital especializada em',
      'custom web design, brand identity, UI/UX design, digital marketing, e-commerce development, and comprehensive digital transformation solutions': 'web design personalizado, identidade de marca, design UI/UX, marketing digital, desenvolvimento de e-commerce e soluções abrangentes de transformação digital',
      'Serving businesses across the US and Canada': 'Atendendo empresas nos Estados Unidos e Canadá',
      'Award-Winning Digital Innovation Agency': 'Agência de Inovação Digital Premiada',
      'Transform your business with Aenfinite': 'Transforme seu negócio com a Aenfinite',
      'Services': 'Serviços',
      'Work': 'Portfólio',
      'Contact': 'Contato',
      'About': 'Sobre',
      'Agency': 'Agência',
      'Blog': 'Blog',
      'Featured Work': 'Trabalhos em Destaque',
      'Privacy Policy': 'Política de Privacidade',
      'Partner With Us': 'Seja Nosso Parceiro',
      'Our Services': 'Nossos Serviços',
      'Our Work': 'Nosso Portfólio',
      'Get in Touch': 'Entre em Contato',
      'Contact Us': 'Fale Conosco',
      'Let\'s Talk': 'Vamos Conversar',
      'View All': 'Ver Tudo',
      'Learn More': 'Saiba Mais',
      'Read More': 'Leia Mais',
      'See More': 'Ver Mais',
      'show more': 'ver mais',
      'All Rights Reserved': 'Todos os Direitos Reservados',
      'Web Design': 'Web Design',
      'Branding': 'Branding',
      'Digital Marketing': 'Marketing Digital',
      'App Development': 'Desenvolvimento de Aplicativos',
      'E-Commerce Websites': 'Sites de E-Commerce',
      'Custom Web Development': 'Desenvolvimento Web Personalizado',
      'Graphic Design': 'Design Gráfico',
      'Logo Design': 'Design de Logotipo',
      'SEO Services': 'Serviços de SEO',
      'Search Engine Optimization': 'Otimização para Mecanismos de Busca',
      'Social Media Marketing': 'Marketing em Mídias Sociais',
      'UI/UX Design': 'Design UI/UX',
      'Packaging Design': 'Design de Embalagens',
      'Paid Ads': 'Anúncios Pagos',
      'Pay Per Click': 'Pagamento por Clique',
      'Conference Branding': 'Branding para Conferências',
      'Trade Show Booth Design': 'Design de Estandes para Feiras',
      'WordPress Websites': 'Sites WordPress',
      'Software & Platform Development': 'Desenvolvimento de Software e Plataformas',
      'AI Chatbots & Virtual Assistants': 'Chatbots de IA e Assistentes Virtuais',
      'Workflow and Business Automation': 'Automação de Processos e Negócios',
      'Web Design and Branding for Real Estate': 'Web Design e Branding para Imóveis',
      'Get Started': 'Começar',
      'Request a Quote': 'Solicitar Orçamento',
      'Schedule a Call': 'Agendar uma Ligação',
      'Free Consultation': 'Consulta Gratuita',
      'Send Message': 'Enviar Mensagem',
    },
  },

  zh: {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '中文',
    dir: 'ltr',
    translations: {
      'Professional Digital Innovation Agency': '专业数字创新机构',
      'Web Design, Branding & Digital Marketing': '网页设计、品牌策划与数字营销',
      'digital innovation agency specializing in': '专注于以下领域的数字创新机构：',
      'custom web design, brand identity, UI/UX design, digital marketing, e-commerce development, and comprehensive digital transformation solutions': '定制网页设计、品牌形象、UI/UX设计、数字营销、电子商务开发及全面的数字化转型解决方案',
      'Serving businesses across the US and Canada': '服务于美国和加拿大的企业',
      'Award-Winning Digital Innovation Agency': '屡获殊荣的数字创新机构',
      'Transform your business with Aenfinite': '通过Aenfinite转型您的业务',
      'Services': '服务',
      'Work': '作品',
      'Contact': '联系我们',
      'About': '关于我们',
      'Agency': '机构',
      'Blog': '博客',
      'Featured Work': '精选作品',
      'Privacy Policy': '隐私政策',
      'Partner With Us': '合作伙伴',
      'Our Services': '我们的服务',
      'Our Work': '我们的作品',
      'Get in Touch': '联系我们',
      'Contact Us': '联系我们',
      'Let\'s Talk': '联系洽谈',
      'View All': '查看全部',
      'Learn More': '了解更多',
      'Read More': '阅读更多',
      'See More': '查看更多',
      'show more': '显示更多',
      'All Rights Reserved': '版权所有',
      'Web Design': '网页设计',
      'Branding': '品牌策划',
      'Digital Marketing': '数字营销',
      'App Development': '应用开发',
      'E-Commerce Websites': '电子商务网站',
      'Custom Web Development': '定制网站开发',
      'Graphic Design': '平面设计',
      'Logo Design': '标志设计',
      'SEO Services': 'SEO服务',
      'Search Engine Optimization': '搜索引擎优化',
      'Social Media Marketing': '社交媒体营销',
      'UI/UX Design': 'UI/UX设计',
      'Packaging Design': '包装设计',
      'Paid Ads': '付费广告',
      'Pay Per Click': '按点击付费',
      'Conference Branding': '会议品牌策划',
      'Trade Show Booth Design': '展会展位设计',
      'WordPress Websites': 'WordPress网站',
      'Software & Platform Development': '软件与平台开发',
      'AI Chatbots & Virtual Assistants': 'AI聊天机器人与虚拟助手',
      'Workflow and Business Automation': '工作流程与业务自动化',
      'Web Design and Branding for Real Estate': '房地产网页设计与品牌策划',
      'Get Started': '立即开始',
      'Request a Quote': '获取报价',
      'Schedule a Call': '预约通话',
      'Free Consultation': '免费咨询',
      'Send Message': '发送消息',
    },
  },

  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    dir: 'ltr',
    translations: {
      'Professional Digital Innovation Agency': 'पेशेवर डिजिटल इनोवेशन एजेंसी',
      'Web Design, Branding & Digital Marketing': 'वेब डिज़ाइन, ब्रांडिंग और डिजिटल मार्केटिंग',
      'digital innovation agency specializing in': 'डिजिटल इनोवेशन एजेंसी जो विशेषज्ञ है',
      'custom web design, brand identity, UI/UX design, digital marketing, e-commerce development, and comprehensive digital transformation solutions': 'कस्टम वेब डिज़ाइन, ब्रांड पहचान, UI/UX डिज़ाइन, डिजिटल मार्केटिंग, ई-कॉमर्स विकास और व्यापक डिजिटल परिवर्तन समाधान',
      'Serving businesses across the US and Canada': 'अमेरिका और कनाडा में व्यवसायों की सेवा',
      'Award-Winning Digital Innovation Agency': 'पुरस्कार-विजेता डिजिटल इनोवेशन एजेंसी',
      'Transform your business with Aenfinite': 'Aenfinite के साथ अपने व्यवसाय को बदलें',
      'Services': 'सेवाएं',
      'Work': 'कार्य',
      'Contact': 'संपर्क',
      'About': 'हमारे बारे में',
      'Agency': 'एजेंसी',
      'Blog': 'ब्लॉग',
      'Featured Work': 'विशेष कार्य',
      'Privacy Policy': 'गोपनीयता नीति',
      'Partner With Us': 'हमारे साथ भागीदार बनें',
      'Our Services': 'हमारी सेवाएं',
      'Our Work': 'हमारा कार्य',
      'Get in Touch': 'संपर्क करें',
      'Contact Us': 'हमसे संपर्क करें',
      'Let\'s Talk': 'बात करें',
      'View All': 'सभी देखें',
      'Learn More': 'और जानें',
      'Read More': 'और पढ़ें',
      'See More': 'और देखें',
      'show more': 'और दिखाएं',
      'All Rights Reserved': 'सर्वाधिकार सुरक्षित',
      'Web Design': 'वेब डिज़ाइन',
      'Branding': 'ब्रांडिंग',
      'Digital Marketing': 'डिजिटल मार्केटिंग',
      'App Development': 'ऐप विकास',
      'E-Commerce Websites': 'ई-कॉमर्स वेबसाइट',
      'Custom Web Development': 'कस्टम वेब विकास',
      'Graphic Design': 'ग्राफिक डिज़ाइन',
      'Logo Design': 'लोगो डिज़ाइन',
      'SEO Services': 'SEO सेवाएं',
      'Search Engine Optimization': 'सर्च इंजन ऑप्टिमाइजेशन',
      'Social Media Marketing': 'सोशल मीडिया मार्केटिंग',
      'UI/UX Design': 'UI/UX डिज़ाइन',
      'Packaging Design': 'पैकेजिंग डिज़ाइन',
      'Paid Ads': 'सशुल्क विज्ञापन',
      'Pay Per Click': 'पे पर क्लिक',
      'Conference Branding': 'कॉन्फ्रेंस ब्रांडिंग',
      'Trade Show Booth Design': 'ट्रेड शो बूथ डिज़ाइन',
      'WordPress Websites': 'वर्डप्रेस वेबसाइट',
      'Software & Platform Development': 'सॉफ्टवेयर और प्लेटफ़ॉर्म विकास',
      'AI Chatbots & Virtual Assistants': 'AI चैटबॉट और वर्चुअल सहायक',
      'Workflow and Business Automation': 'वर्कफ़्लो और बिज़नेस ऑटोमेशन',
      'Web Design and Branding for Real Estate': 'रियल एस्टेट के लिए वेब डिज़ाइन और ब्रांडिंग',
      'Get Started': 'शुरू करें',
      'Request a Quote': 'कोटेशन अनुरोध करें',
      'Schedule a Call': 'कॉल शेड्यूल करें',
      'Free Consultation': 'मुफ़्त परामर्श',
      'Send Message': 'संदेश भेजें',
    },
  },

  nl: {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    dir: 'ltr',
    translations: {
      'Professional Digital Innovation Agency': 'Professioneel Bureau voor Digitale Innovatie',
      'Web Design, Branding & Digital Marketing': 'Webdesign, Branding en Digitale Marketing',
      'digital innovation agency specializing in': 'bureau voor digitale innovatie, gespecialiseerd in',
      'custom web design, brand identity, UI/UX design, digital marketing, e-commerce development, and comprehensive digital transformation solutions': 'op maat gemaakt webdesign, merkidentiteit, UI/UX-ontwerp, digitale marketing, e-commerce ontwikkeling en uitgebreide oplossingen voor digitale transformatie',
      'Serving businesses across the US and Canada': 'Dienstverlening aan bedrijven in de VS en Canada',
      'Award-Winning Digital Innovation Agency': 'Prijswinnend Bureau voor Digitale Innovatie',
      'Transform your business with Aenfinite': 'Transformeer uw bedrijf met Aenfinite',
      'Services': 'Diensten',
      'Work': 'Portfolio',
      'Contact': 'Contact',
      'About': 'Over ons',
      'Agency': 'Bureau',
      'Blog': 'Blog',
      'Featured Work': 'Uitgelicht Werk',
      'Privacy Policy': 'Privacybeleid',
      'Partner With Us': 'Word Partner',
      'Our Services': 'Onze Diensten',
      'Our Work': 'Ons Portfolio',
      'Get in Touch': 'Neem Contact Op',
      'Contact Us': 'Neem Contact Op',
      'Let\'s Talk': 'Laten We Praten',
      'View All': 'Bekijk Alles',
      'Learn More': 'Meer Informatie',
      'Read More': 'Lees Meer',
      'See More': 'Bekijk Meer',
      'show more': 'meer tonen',
      'All Rights Reserved': 'Alle Rechten Voorbehouden',
      'Web Design': 'Webdesign',
      'Branding': 'Merkontwerp',
      'Digital Marketing': 'Digitale Marketing',
      'App Development': 'App Ontwikkeling',
      'E-Commerce Websites': 'E-Commerce Websites',
      'Custom Web Development': 'Op Maat Webontwikkeling',
      'Graphic Design': 'Grafisch Ontwerp',
      'Logo Design': 'Logo Ontwerp',
      'SEO Services': 'SEO Diensten',
      'Search Engine Optimization': 'Zoekmachineoptimalisatie',
      'Social Media Marketing': 'Social Media Marketing',
      'UI/UX Design': 'UI/UX Ontwerp',
      'Packaging Design': 'Verpakkingsontwerp',
      'Paid Ads': 'Betaalde Advertenties',
      'Pay Per Click': 'Pay Per Click',
      'Conference Branding': 'Conferentie Branding',
      'Trade Show Booth Design': 'Beursstand Ontwerp',
      'WordPress Websites': 'WordPress Websites',
      'Software & Platform Development': 'Software- en Platformontwikkeling',
      'AI Chatbots & Virtual Assistants': 'AI Chatbots en Virtuele Assistenten',
      'Workflow and Business Automation': 'Workflow- en Bedrijfsautomatisering',
      'Web Design and Branding for Real Estate': 'Webdesign en Branding voor Vastgoed',
      'Get Started': 'Aan de Slag',
      'Request a Quote': 'Offerte Aanvragen',
      'Schedule a Call': 'Gesprek Plannen',
      'Free Consultation': 'Gratis Adviesgesprek',
      'Send Message': 'Bericht Versturen',
    },
  },

  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    dir: 'ltr',
    translations: {
      'Professional Digital Innovation Agency': 'プロフェッショナルデジタルイノベーションエージェンシー',
      'Web Design, Branding & Digital Marketing': 'Webデザイン、ブランディング＆デジタルマーケティング',
      'digital innovation agency specializing in': '以下に特化したデジタルイノベーションエージェンシー：',
      'custom web design, brand identity, UI/UX design, digital marketing, e-commerce development, and comprehensive digital transformation solutions': 'カスタムWebデザイン、ブランドアイデンティティ、UI/UXデザイン、デジタルマーケティング、ECサイト開発、包括的なデジタルトランスフォーメーションソリューション',
      'Serving businesses across the US and Canada': 'アメリカ・カナダのビジネスをサポート',
      'Award-Winning Digital Innovation Agency': '受賞歴のあるデジタルイノベーションエージェンシー',
      'Transform your business with Aenfinite': 'Aenfiniteでビジネスを変革',
      'Services': 'サービス',
      'Work': '実績',
      'Contact': 'お問い合わせ',
      'About': '会社概要',
      'Agency': 'エージェンシー',
      'Blog': 'ブログ',
      'Featured Work': '注目の実績',
      'Privacy Policy': 'プライバシーポリシー',
      'Partner With Us': 'パートナー募集',
      'Our Services': '私たちのサービス',
      'Our Work': '私たちの実績',
      'Get in Touch': 'お問い合わせ',
      'Contact Us': 'お問い合わせ',
      'Let\'s Talk': 'ご相談ください',
      'View All': 'すべて見る',
      'Learn More': '詳しく見る',
      'Read More': '続きを読む',
      'See More': 'もっと見る',
      'show more': 'もっと見る',
      'All Rights Reserved': '無断転載禁止',
      'Web Design': 'Webデザイン',
      'Branding': 'ブランディング',
      'Digital Marketing': 'デジタルマーケティング',
      'App Development': 'アプリ開発',
      'E-Commerce Websites': 'ECサイト制作',
      'Custom Web Development': 'カスタムWeb開発',
      'Graphic Design': 'グラフィックデザイン',
      'Logo Design': 'ロゴデザイン',
      'SEO Services': 'SEOサービス',
      'Search Engine Optimization': '検索エンジン最適化',
      'Social Media Marketing': 'SNSマーケティング',
      'UI/UX Design': 'UI/UXデザイン',
      'Packaging Design': 'パッケージデザイン',
      'Paid Ads': '有料広告',
      'Pay Per Click': 'クリック課金型広告',
      'Conference Branding': 'カンファレンスブランディング',
      'Trade Show Booth Design': '展示会ブースデザイン',
      'WordPress Websites': 'WordPressサイト制作',
      'Software & Platform Development': 'ソフトウェア＆プラットフォーム開発',
      'AI Chatbots & Virtual Assistants': 'AIチャットボット＆バーチャルアシスタント',
      'Workflow and Business Automation': 'ワークフロー＆ビジネス自動化',
      'Web Design and Branding for Real Estate': '不動産向けWebデザイン＆ブランディング',
      'Get Started': '始めましょう',
      'Request a Quote': '見積もりを依頼',
      'Schedule a Call': '通話を予約',
      'Free Consultation': '無料相談',
      'Send Message': 'メッセージを送信',
    },
  },

  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    dir: 'ltr',
    translations: {
      'Professional Digital Innovation Agency': '전문 디지털 혁신 에이전시',
      'Web Design, Branding & Digital Marketing': '웹 디자인, 브랜딩 & 디지털 마케팅',
      'digital innovation agency specializing in': '다음을 전문으로 하는 디지털 혁신 에이전시:',
      'custom web design, brand identity, UI/UX design, digital marketing, e-commerce development, and comprehensive digital transformation solutions': '맞춤형 웹 디자인, 브랜드 아이덴티티, UI/UX 디자인, 디지털 마케팅, 이커머스 개발 및 종합 디지털 전환 솔루션',
      'Serving businesses across the US and Canada': '미국과 캐나다 전역의 비즈니스를 지원합니다',
      'Award-Winning Digital Innovation Agency': '수상 경력의 디지털 혁신 에이전시',
      'Transform your business with Aenfinite': 'Aenfinite로 비즈니스를 혁신하세요',
      'Services': '서비스',
      'Work': '포트폴리오',
      'Contact': '문의',
      'About': '소개',
      'Agency': '에이전시',
      'Blog': '블로그',
      'Featured Work': '주요 프로젝트',
      'Privacy Policy': '개인정보 처리방침',
      'Partner With Us': '파트너십',
      'Our Services': '우리의 서비스',
      'Our Work': '우리의 포트폴리오',
      'Get in Touch': '문의하기',
      'Contact Us': '연락하기',
      'Let\'s Talk': '상담하기',
      'View All': '전체 보기',
      'Learn More': '더 알아보기',
      'Read More': '더 읽기',
      'See More': '더 보기',
      'show more': '더 보기',
      'All Rights Reserved': '모든 권리 보유',
      'Web Design': '웹 디자인',
      'Branding': '브랜딩',
      'Digital Marketing': '디지털 마케팅',
      'App Development': '앱 개발',
      'E-Commerce Websites': '이커머스 웹사이트',
      'Custom Web Development': '맞춤형 웹 개발',
      'Graphic Design': '그래픽 디자인',
      'Logo Design': '로고 디자인',
      'SEO Services': 'SEO 서비스',
      'Search Engine Optimization': '검색 엔진 최적화',
      'Social Media Marketing': '소셜 미디어 마케팅',
      'UI/UX Design': 'UI/UX 디자인',
      'Packaging Design': '패키지 디자인',
      'Paid Ads': '유료 광고',
      'Pay Per Click': 'PPC 광고',
      'Conference Branding': '컨퍼런스 브랜딩',
      'Trade Show Booth Design': '전시회 부스 디자인',
      'WordPress Websites': '워드프레스 웹사이트',
      'Software & Platform Development': '소프트웨어 & 플랫폼 개발',
      'AI Chatbots & Virtual Assistants': 'AI 챗봇 & 가상 비서',
      'Workflow and Business Automation': '워크플로우 & 비즈니스 자동화',
      'Web Design and Branding for Real Estate': '부동산 웹 디자인 & 브랜딩',
      'Get Started': '시작하기',
      'Request a Quote': '견적 요청',
      'Schedule a Call': '통화 예약',
      'Free Consultation': '무료 상담',
      'Send Message': '메시지 보내기',
    },
  },
};

// All supported language codes (including English)
const ALL_LANG_CODES = ['en', ...Object.keys(LANGUAGES)];

// Auto-discover all pages from app/ directory
// Excludes: language folders, city templates, API routes, components
const EXCLUDED_DIRS = new Set(['api', 'components', 'city', 'cities', ...Object.keys(LANGUAGES)]);

function discoverPages(dir, prefix = '') {
  const pages = [];
  if (!fs.existsSync(dir)) return pages;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  // Check if this directory has a page.tsx
  if (entries.some(e => e.name === 'page.tsx')) {
    pages.push(prefix);
  }
  
  // Recurse into subdirectories
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
    
    const subPrefix = prefix ? `${prefix}/${entry.name}` : entry.name;
    pages.push(...discoverPages(path.join(dir, entry.name), subPrefix));
  }
  
  return pages;
}

const PAGES_TO_TRANSLATE = discoverPages(APP_DIR);
console.log(`Discovered ${PAGES_TO_TRANSLATE.length} pages to translate`);

// ============================================================================
// TRANSLATION ENGINE
// ============================================================================

/**
 * Apply translations to page content - replaces English strings with
 * target language equivalents. Handles metadata and HTML content.
 */
function translateContent(content, lang) {
  const cfg = LANGUAGES[lang];
  if (!cfg) return content;

  let result = content;

  // Sort translations by length (longest first) to avoid partial matches
  const sortedKeys = Object.keys(cfg.translations).sort((a, b) => b.length - a.length);

  for (const eng of sortedKeys) {
    const translated = cfg.translations[eng];
    if (!translated) continue;
    // Use split/join for global literal replacement
    result = result.split(eng).join(translated);
  }

  return result;
}

/**
 * Transform metadata block for a language version
 */
function transformMetadata(content, lang, pagePath) {
  let result = content;
  const cfg = LANGUAGES[lang];

  // Update canonical URL to language version
  const langPrefix = `https://aenfinite.com/${lang}/`;
  const pageSlug = pagePath || '';
  const langUrl = langPrefix + (pageSlug ? pageSlug + '/' : '');

  // Replace canonical
  result = result.replace(
    /alternates:\s*\{[^}]*canonical:\s*"[^"]*"[^}]*\}/,
    `alternates: { canonical: "${langUrl}" }`
  );

  // Replace OG url
  result = result.replace(
    /"url"\s*:\s*"https:\/\/aenfinite\.com\/[^"]*"/g,
    `"url":"${langUrl}"`
  );

  // Add alternates.languages for per-page hreflang
  const languagesObj = {};
  languagesObj['x-default'] = `https://aenfinite.com/${pageSlug ? pageSlug + '/' : ''}`;
  languagesObj['en'] = `https://aenfinite.com/${pageSlug ? pageSlug + '/' : ''}`;
  for (const code of Object.keys(LANGUAGES)) {
    languagesObj[code] = `https://aenfinite.com/${code}/${pageSlug ? pageSlug + '/' : ''}`;
  }

  // Replace the alternates block to include languages
  result = result.replace(
    /alternates:\s*\{[^}]*\}/,
    `alternates: { canonical: "${langUrl}", languages: ${JSON.stringify(languagesObj)} }`
  );

  return result;
}

/**
 * Add RTL support for Arabic
 */
function addRTLSupport(content, lang) {
  if (LANGUAGES[lang]?.dir !== 'rtl') return content;

  // Add dir="rtl" to the container div in HtmlPage
  // This is handled via a wrapper in the page template
  return content;
}

/**
 * Generate a single language page
 */
function generateLangPage(sourcePath, langCode, pagePath) {
  const content = fs.readFileSync(sourcePath, 'utf8');
  let result = content;

  // 1. Translate content strings
  result = translateContent(result, langCode);

  // 2. Transform metadata (canonical, OG URLs)
  result = transformMetadata(result, langCode, pagePath);

  // 3. Add language indicator comment at top
  const langComment = `// Language: ${LANGUAGES[langCode].name} (${langCode})\n// Auto-generated from English source - do not edit directly\n`;
  result = langComment + result;

  return result;
}

/**
 * Create the language layout.tsx that sets the correct lang attribute
 */
function createLangLayout(langCode) {
  const cfg = LANGUAGES[langCode];
  const dirAttr = cfg.dir === 'rtl' ? `\n      dir="${cfg.dir}"` : '';
  const rtlStyle = cfg.dir === 'rtl' ? `
        <style>{\`
          body { direction: rtl; text-align: right; }
          .rtl-flip { transform: scaleX(-1); }
        \`}</style>` : '';

  return `// Language: ${cfg.name} (${langCode})
// Auto-generated layout for ${cfg.nativeName} pages
export default function ${cfg.name.replace(/[^a-zA-Z]/g, '')}Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="${langCode}"${dirAttr}>${rtlStyle}
      {children}
    </div>
  );
}
`;
}

// ============================================================================
// HREFLANG GENERATOR
// ============================================================================

/**
 * Generate hreflang link tags for a given page path
 */
function generateHreflangTags(pagePath) {
  const baseUrl = 'https://aenfinite.com';
  const slug = pagePath ? `/${pagePath}/` : '/';
  
  let tags = [];
  // x-default = English
  tags.push(`<link rel="alternate" hrefLang="x-default" href="${baseUrl}${slug}" />`);
  tags.push(`<link rel="alternate" hrefLang="en" href="${baseUrl}${slug}" />`);
  
  for (const code of Object.keys(LANGUAGES)) {
    tags.push(`<link rel="alternate" hrefLang="${code}" href="${baseUrl}/${code}${slug}" />`);
  }

  return tags.join('\n        ');
}

// ============================================================================
// FILE OPERATIONS
// ============================================================================

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function generateLanguage(langCode) {
  const cfg = LANGUAGES[langCode];
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  Generating: ${cfg.name} (${langCode}) — ${cfg.nativeName}`);
  console.log(`${'='.repeat(60)}`);

  const langDir = path.join(APP_DIR, langCode);
  
  // Remove existing lang dir
  if (fs.existsSync(langDir)) {
    fs.rmSync(langDir, { recursive: true });
  }

  // Create lang layout
  ensureDir(langDir);
  fs.writeFileSync(path.join(langDir, 'layout.tsx'), createLangLayout(langCode));
  console.log(`  ✓ layout.tsx created`);

  let pagesCreated = 0;

  for (const pagePath of PAGES_TO_TRANSLATE) {
    const sourceFile = pagePath
      ? path.join(APP_DIR, pagePath, 'page.tsx')
      : path.join(APP_DIR, 'page.tsx');

    if (!fs.existsSync(sourceFile)) {
      console.log(`  ⚠ Skipping ${pagePath || '/'} — source not found`);
      continue;
    }

    // Create target directory
    const targetDir = pagePath
      ? path.join(langDir, pagePath)
      : langDir;
    ensureDir(targetDir);

    // Generate translated page
    const translatedContent = generateLangPage(sourceFile, langCode, pagePath);
    fs.writeFileSync(path.join(targetDir, 'page.tsx'), translatedContent);
    pagesCreated++;
  }

  console.log(`  ✓ ${pagesCreated} pages created`);
  return pagesCreated;
}

// ============================================================================
// HREFLANG INJECTION INTO ENGLISH PAGES
// ============================================================================

function injectHreflangTags() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  Injecting hreflang tags into layout.tsx`);
  console.log(`${'='.repeat(60)}`);

  const layoutPath = path.join(APP_DIR, 'layout.tsx');
  let layout = fs.readFileSync(layoutPath, 'utf8');

  // Remove any existing hreflang block
  layout = layout.replace(/\n\s*{\/\* HREFLANG TAGS[\s\S]*?END HREFLANG \*\/}/g, '');

  // Build hreflang tags for homepage (layout-level = applies to all pages)
  // Individual page hreflang is better done per-page, but layout-level
  // provides the base signal
  const hreflangBlock = `
        {/* HREFLANG TAGS - Global language alternates */}
        <link rel="alternate" hrefLang="x-default" href="https://aenfinite.com/" />
        <link rel="alternate" hrefLang="en" href="https://aenfinite.com/" />
${Object.keys(LANGUAGES).map(code => 
  `        <link rel="alternate" hrefLang="${code}" href="https://aenfinite.com/${code}/" />`
).join('\n')}
        {/* END HREFLANG */}`;

  // Inject after the font preconnect block
  if (layout.includes('{/* DNS prefetch')) {
    layout = layout.replace(
      /({\/\* DNS prefetch[^}]*})/,
      `$1\n${hreflangBlock}`
    );
  } else {
    // Fallback: inject at end of <head>
    layout = layout.replace(
      '</head>',
      `${hreflangBlock}\n      </head>`
    );
  }

  fs.writeFileSync(layoutPath, layout);
  console.log(`  ✓ hreflang tags injected (${Object.keys(LANGUAGES).length + 2} alternates)`);
}

/**
 * Add alternates.languages to English source pages for proper per-page hreflang
 */
function injectHreflangIntoEnglishPages() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  Adding alternates.languages to English pages`);
  console.log(`${'='.repeat(60)}`);

  let updated = 0;
  for (const pagePath of PAGES_TO_TRANSLATE) {
    const sourceFile = pagePath
      ? path.join(APP_DIR, pagePath, 'page.tsx')
      : path.join(APP_DIR, 'page.tsx');

    if (!fs.existsSync(sourceFile)) continue;

    let content = fs.readFileSync(sourceFile, 'utf8');
    const pageSlug = pagePath || '';
    const canonicalUrl = `https://aenfinite.com/${pageSlug ? pageSlug + '/' : ''}`;

    // Build languages object
    const languagesObj = {};
    languagesObj['x-default'] = canonicalUrl;
    languagesObj['en'] = canonicalUrl;
    for (const code of Object.keys(LANGUAGES)) {
      languagesObj[code] = `https://aenfinite.com/${code}/${pageSlug ? pageSlug + '/' : ''}`;
    }

    // Check if alternates.languages already present
    if (content.includes('languages:')) continue;

    // Replace alternates block
    const newAlternates = `alternates: { canonical: "${canonicalUrl}", languages: ${JSON.stringify(languagesObj)} }`;
    content = content.replace(
      /alternates:\s*\{[^}]*canonical:\s*"[^"]*"[^}]*\}/,
      newAlternates
    );

    fs.writeFileSync(sourceFile, content);
    updated++;
  }

  console.log(`  ✓ ${updated} English pages updated with alternates.languages`);
}

// ============================================================================
// VERIFICATION
// ============================================================================

function verify() {
  console.log('\nVerifying language structure...\n');
  let total = 0;
  for (const [code, cfg] of Object.entries(LANGUAGES)) {
    const langDir = path.join(APP_DIR, code);
    if (!fs.existsSync(langDir)) {
      console.log(`  ✗ ${code} (${cfg.name}) — directory missing`);
      continue;
    }
    const pages = [];
    function countPages(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) countPages(path.join(dir, entry.name));
        else if (entry.name === 'page.tsx') pages.push(path.relative(langDir, path.join(dir, entry.name)));
      }
    }
    countPages(langDir);
    const hasLayout = fs.existsSync(path.join(langDir, 'layout.tsx'));
    console.log(`  ✓ ${code} (${cfg.nativeName.padEnd(10)}) — ${pages.length} pages, layout=${hasLayout ? '✓' : '✗'}`);
    total += pages.length;
  }
  
  // Check hreflang in layout
  const layout = fs.readFileSync(path.join(APP_DIR, 'layout.tsx'), 'utf8');
  const hreflangCount = (layout.match(/hrefLang=/g) || []).length;
  console.log(`\n  Layout hreflang tags: ${hreflangCount}`);
  console.log(`  Total language pages: ${total}`);
}

// ============================================================================
// CLI ENTRY POINT
// ============================================================================

const args = process.argv.slice(2);
const startTime = Date.now();

if (args[0] === '--verify') {
  verify();
} else if (args[0] && LANGUAGES[args[0]]) {
  // Generate single language
  generateLanguage(args[0]);
  injectHreflangTags();
} else if (args[0]) {
  console.error(`Unknown language: ${args[0]}. Available: ${Object.keys(LANGUAGES).join(', ')}`);
  process.exit(1);
} else {
  // Generate all languages
  console.log(`\n🌍 Aenfinite Global Language Expansion`);
  console.log(`   Generating ${Object.keys(LANGUAGES).length} languages × ${PAGES_TO_TRANSLATE.length} pages...\n`);

  let totalPages = 0;
  for (const code of Object.keys(LANGUAGES)) {
    totalPages += generateLanguage(code);
  }

  // Inject hreflang into main layout
  injectHreflangTags();

  // Add alternates.languages to English source pages
  injectHreflangIntoEnglishPages();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  COMPLETE: ${Object.keys(LANGUAGES).length} languages, ${totalPages} total pages (${elapsed}s)`);
  console.log(`${'='.repeat(60)}\n`);

  // Verify
  verify();
}
