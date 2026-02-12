// Internationalization (i18n) System for NeoBI India
// Supports: English, Hindi, Tamil, Marathi, Bengali

export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'mr' | 'bn' | 'te';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', direction: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', direction: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', direction: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', direction: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', direction: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', direction: 'ltr' },
];

// Translation keys organized by category
export interface Translations {
  // Common UI
  common: {
    dashboard: string;
    reports: string;
    settings: string;
    export: string;
    share: string;
    save: string;
    cancel: string;
    submit: string;
    loading: string;
    error: string;
    success: string;
    search: string;
    filter: string;
    viewAll: string;
    close: string;
    expand: string;
    collapse: string;
  };
  // Navigation
  nav: {
    home: string;
    advanced: string;
    benchmarks: string;
    report: string;
    profile: string;
    logout: string;
  };
  // Business Intelligence
  business: {
    mrr: string;
    revenue: string;
    expenses: string;
    profit: string;
    growth: string;
    runway: string;
    burnRate: string;
    teamSize: string;
    industry: string;
    location: string;
    founded: string;
  };
  // GST & Compliance
  gst: {
    title: string;
    compliance: string;
    filingStatus: string;
    pendingReturns: string;
    inputTax: string;
    outputTax: string;
    netPayable: string;
    itcBalance: string;
    gstr1: string;
    gstr3b: string;
    dueDate: string;
    filed: string;
    pending: string;
    overdue: string;
  };
  // Funding
  funding: {
    title: string;
    readinessScore: string;
    stage: string;
    valuation: string;
    investors: string;
    preSeed: string;
    seed: string;
    seriesA: string;
    seriesB: string;
    strengths: string;
    improvements: string;
  };
  // Market Entry
  market: {
    title: string;
    targetState: string;
    marketSize: string;
    regulatoryEase: string;
    infrastructure: string;
    digitalPenetration: string;
    roi: string;
    riskFactors: string;
    entryStrategy: string;
    breakeven: string;
  };
  // Cash Flow
  cashflow: {
    title: string;
    balance: string;
    inflow: string;
    outflow: string;
    projection: string;
    days30: string;
    days60: string;
    days90: string;
    runway: string;
    alerts: string;
  };
  // Workforce
  workforce: {
    title: string;
    currentStaff: string;
    required: string;
    gap: string;
    hiring: string;
    roles: string;
    priority: string;
    cost: string;
    timeline: string;
    festivalImpact: string;
  };
  // Competitor
  competitor: {
    title: string;
    marketShare: string;
    ranking: string;
    strengths: string;
    weaknesses: string;
    benchmark: string;
    addCompetitor: string;
  };
  // Voice Input
  voice: {
    title: string;
    tapToSpeak: string;
    listening: string;
    tryCommands: string;
    notSupported: string;
  };
  // WhatsApp
  whatsapp: {
    title: string;
    shareReport: string;
    directMessage: string;
    shareLink: string;
    phoneNumber: string;
    recentShares: string;
  };
  // Excel Export
  excel: {
    title: string;
    exportAll: string;
    exportSelected: string;
    businessProfile: string;
    financialReport: string;
    competitorAnalysis: string;
    roadmapDecisions: string;
  };
  // Integrations
  integrations: {
    title: string;
    tally: string;
    zoho: string;
    gstPortal: string;
    connected: string;
    disconnected: string;
    configure: string;
  };
  // Roadmap
  roadmap: {
    title: string;
    decisions: string;
    optimalPath: string;
    yourPath: string;
    matchScore: string;
    expectedRoi: string;
    timeline: string;
    aiRecommendation: string;
  };
  // Alerts & Messages
  alerts: {
    lowRunway: string;
    gstDue: string;
    hiringNeeded: string;
    supplierRisk: string;
    cashflowWarning: string;
  };
}

// English Translations (Default)
const en: Translations = {
  common: {
    dashboard: 'Dashboard',
    reports: 'Reports',
    settings: 'Settings',
    export: 'Export',
    share: 'Share',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    search: 'Search',
    filter: 'Filter',
    viewAll: 'View All',
    close: 'Close',
    expand: 'Expand',
    collapse: 'Collapse',
  },
  nav: {
    home: 'Home',
    advanced: 'Advanced',
    benchmarks: 'Benchmarks',
    report: 'Report',
    profile: 'Profile',
    logout: 'Logout',
  },
  business: {
    mrr: 'Monthly Recurring Revenue',
    revenue: 'Revenue',
    expenses: 'Expenses',
    profit: 'Profit',
    growth: 'Growth Rate',
    runway: 'Runway',
    burnRate: 'Burn Rate',
    teamSize: 'Team Size',
    industry: 'Industry',
    location: 'Location',
    founded: 'Founded',
  },
  gst: {
    title: 'GST Compliance',
    compliance: 'Compliance Score',
    filingStatus: 'Filing Status',
    pendingReturns: 'Pending Returns',
    inputTax: 'Input Tax Credit',
    outputTax: 'Output Tax',
    netPayable: 'Net GST Payable',
    itcBalance: 'ITC Balance',
    gstr1: 'GSTR-1',
    gstr3b: 'GSTR-3B',
    dueDate: 'Due Date',
    filed: 'Filed',
    pending: 'Pending',
    overdue: 'Overdue',
  },
  funding: {
    title: 'Funding Readiness',
    readinessScore: 'Readiness Score',
    stage: 'Recommended Stage',
    valuation: 'Estimated Valuation',
    investors: 'Potential Investors',
    preSeed: 'Pre-Seed',
    seed: 'Seed',
    seriesA: 'Series A',
    seriesB: 'Series B',
    strengths: 'Strengths',
    improvements: 'Areas to Improve',
  },
  market: {
    title: 'Market Entry',
    targetState: 'Target State',
    marketSize: 'Market Size',
    regulatoryEase: 'Regulatory Ease',
    infrastructure: 'Infrastructure',
    digitalPenetration: 'Digital Penetration',
    roi: 'Expected ROI',
    riskFactors: 'Risk Factors',
    entryStrategy: 'Entry Strategy',
    breakeven: 'Break-even Timeline',
  },
  cashflow: {
    title: 'Cash Flow',
    balance: 'Current Balance',
    inflow: 'Inflows',
    outflow: 'Outflows',
    projection: 'Projection',
    days30: '30 Days',
    days60: '60 Days',
    days90: '90 Days',
    runway: 'Runway',
    alerts: 'Alerts',
  },
  workforce: {
    title: 'Workforce Planning',
    currentStaff: 'Current Staff',
    required: 'Required',
    gap: 'Gap',
    hiring: 'Hiring Plan',
    roles: 'Roles Needed',
    priority: 'Priority',
    cost: 'Monthly Cost',
    timeline: 'Hire By',
    festivalImpact: 'Festival Impact',
  },
  competitor: {
    title: 'Competitor Benchmark',
    marketShare: 'Market Share',
    ranking: 'Your Ranking',
    strengths: 'Strengths',
    weaknesses: 'Weaknesses',
    benchmark: 'Benchmark Score',
    addCompetitor: 'Add Competitor',
  },
  voice: {
    title: 'Voice Input',
    tapToSpeak: 'Tap to speak',
    listening: 'Listening...',
    tryCommands: 'Try saying',
    notSupported: 'Voice not supported',
  },
  whatsapp: {
    title: 'WhatsApp Share',
    shareReport: 'Share Report',
    directMessage: 'Direct Message',
    shareLink: 'Share Link',
    phoneNumber: 'Phone Number',
    recentShares: 'Recent Shares',
  },
  excel: {
    title: 'Export to Excel',
    exportAll: 'Export All',
    exportSelected: 'Export Selected',
    businessProfile: 'Business Profile',
    financialReport: 'Financial Report',
    competitorAnalysis: 'Competitor Analysis',
    roadmapDecisions: 'Roadmap Decisions',
  },
  integrations: {
    title: 'Integrations',
    tally: 'Tally ERP',
    zoho: 'Zoho Books',
    gstPortal: 'GST Portal',
    connected: 'Connected',
    disconnected: 'Not Connected',
    configure: 'Configure',
  },
  roadmap: {
    title: 'Strategy Roadmap',
    decisions: 'Decisions',
    optimalPath: 'Optimal Path',
    yourPath: 'Your Path',
    matchScore: 'Match Score',
    expectedRoi: 'Expected ROI',
    timeline: 'Timeline',
    aiRecommendation: 'AI Recommendation',
  },
  alerts: {
    lowRunway: 'Low runway warning',
    gstDue: 'GST filing due soon',
    hiringNeeded: 'Hiring needed',
    supplierRisk: 'Supplier risk detected',
    cashflowWarning: 'Cash flow warning',
  },
};

// Hindi Translations
const hi: Translations = {
  common: {
    dashboard: 'डैशबोर्ड',
    reports: 'रिपोर्ट',
    settings: 'सेटिंग्स',
    export: 'निर्यात',
    share: 'शेयर',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    submit: 'जमा करें',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफल',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    viewAll: 'सभी देखें',
    close: 'बंद करें',
    expand: 'विस्तार करें',
    collapse: 'संक्षिप्त करें',
  },
  nav: {
    home: 'होम',
    advanced: 'उन्नत',
    benchmarks: 'बेंचमार्क',
    report: 'रिपोर्ट',
    profile: 'प्रोफ़ाइल',
    logout: 'लॉगआउट',
  },
  business: {
    mrr: 'मासिक आवर्ती राजस्व',
    revenue: 'राजस्व',
    expenses: 'व्यय',
    profit: 'लाभ',
    growth: 'वृद्धि दर',
    runway: 'रनवे',
    burnRate: 'बर्न रेट',
    teamSize: 'टीम का आकार',
    industry: 'उद्योग',
    location: 'स्थान',
    founded: 'स्थापित',
  },
  gst: {
    title: 'जीएसटी अनुपालन',
    compliance: 'अनुपालन स्कोर',
    filingStatus: 'फाइलिंग स्थिति',
    pendingReturns: 'लंबित रिटर्न',
    inputTax: 'इनपुट टैक्स क्रेडिट',
    outputTax: 'आउटपुट टैक्स',
    netPayable: 'शुद्ध जीएसटी देय',
    itcBalance: 'आईटीसी बैलेंस',
    gstr1: 'जीएसटीआर-1',
    gstr3b: 'जीएसटीआर-3बी',
    dueDate: 'नियत तारीख',
    filed: 'दाखिल',
    pending: 'लंबित',
    overdue: 'अतिदेय',
  },
  funding: {
    title: 'फंडिंग तैयारी',
    readinessScore: 'तैयारी स्कोर',
    stage: 'अनुशंसित चरण',
    valuation: 'अनुमानित मूल्यांकन',
    investors: 'संभावित निवेशक',
    preSeed: 'प्री-सीड',
    seed: 'सीड',
    seriesA: 'सीरीज़ A',
    seriesB: 'सीरीज़ B',
    strengths: 'ताकत',
    improvements: 'सुधार के क्षेत्र',
  },
  market: {
    title: 'बाजार प्रवेश',
    targetState: 'लक्ष्य राज्य',
    marketSize: 'बाजार का आकार',
    regulatoryEase: 'नियामक सुगमता',
    infrastructure: 'बुनियादी ढांचा',
    digitalPenetration: 'डिजिटल प्रवेश',
    roi: 'अपेक्षित आरओआई',
    riskFactors: 'जोखिम कारक',
    entryStrategy: 'प्रवेश रणनीति',
    breakeven: 'ब्रेक-ईवन समयरेखा',
  },
  cashflow: {
    title: 'नकदी प्रवाह',
    balance: 'वर्तमान शेष',
    inflow: 'आवक',
    outflow: 'जावक',
    projection: 'अनुमान',
    days30: '30 दिन',
    days60: '60 दिन',
    days90: '90 दिन',
    runway: 'रनवे',
    alerts: 'अलर्ट',
  },
  workforce: {
    title: 'कार्यबल योजना',
    currentStaff: 'वर्तमान स्टाफ',
    required: 'आवश्यक',
    gap: 'अंतर',
    hiring: 'भर्ती योजना',
    roles: 'आवश्यक भूमिकाएं',
    priority: 'प्राथमिकता',
    cost: 'मासिक लागत',
    timeline: 'भर्ती तक',
    festivalImpact: 'त्योहार प्रभाव',
  },
  competitor: {
    title: 'प्रतियोगी बेंचमार्क',
    marketShare: 'बाजार हिस्सेदारी',
    ranking: 'आपकी रैंकिंग',
    strengths: 'ताकतें',
    weaknesses: 'कमजोरियां',
    benchmark: 'बेंचमार्क स्कोर',
    addCompetitor: 'प्रतियोगी जोड़ें',
  },
  voice: {
    title: 'आवाज इनपुट',
    tapToSpeak: 'बोलने के लिए टैप करें',
    listening: 'सुन रहा है...',
    tryCommands: 'कहने की कोशिश करें',
    notSupported: 'आवाज समर्थित नहीं',
  },
  whatsapp: {
    title: 'व्हाट्सएप शेयर',
    shareReport: 'रिपोर्ट शेयर करें',
    directMessage: 'सीधा संदेश',
    shareLink: 'लिंक शेयर करें',
    phoneNumber: 'फोन नंबर',
    recentShares: 'हाल के शेयर',
  },
  excel: {
    title: 'एक्सेल में निर्यात',
    exportAll: 'सभी निर्यात करें',
    exportSelected: 'चयनित निर्यात करें',
    businessProfile: 'व्यापार प्रोफ़ाइल',
    financialReport: 'वित्तीय रिपोर्ट',
    competitorAnalysis: 'प्रतियोगी विश्लेषण',
    roadmapDecisions: 'रोडमैप निर्णय',
  },
  integrations: {
    title: 'एकीकरण',
    tally: 'टैली ईआरपी',
    zoho: 'ज़ोहो बुक्स',
    gstPortal: 'जीएसटी पोर्टल',
    connected: 'कनेक्टेड',
    disconnected: 'कनेक्ट नहीं',
    configure: 'कॉन्फ़िगर करें',
  },
  roadmap: {
    title: 'रणनीति रोडमैप',
    decisions: 'निर्णय',
    optimalPath: 'इष्टतम पथ',
    yourPath: 'आपका पथ',
    matchScore: 'मैच स्कोर',
    expectedRoi: 'अपेक्षित आरओआई',
    timeline: 'समयरेखा',
    aiRecommendation: 'एआई सिफारिश',
  },
  alerts: {
    lowRunway: 'कम रनवे चेतावनी',
    gstDue: 'जीएसटी फाइलिंग जल्द देय',
    hiringNeeded: 'भर्ती आवश्यक',
    supplierRisk: 'आपूर्तिकर्ता जोखिम',
    cashflowWarning: 'नकदी प्रवाह चेतावनी',
  },
};

// Tamil Translations
const ta: Translations = {
  common: {
    dashboard: 'டாஷ்போர்டு',
    reports: 'அறிக்கைகள்',
    settings: 'அமைப்புகள்',
    export: 'ஏற்றுமதி',
    share: 'பகிர்',
    save: 'சேமி',
    cancel: 'ரத்து',
    submit: 'சமர்ப்பி',
    loading: 'ஏற்றுகிறது...',
    error: 'பிழை',
    success: 'வெற்றி',
    search: 'தேடு',
    filter: 'வடிகட்டி',
    viewAll: 'அனைத்தையும் காண்க',
    close: 'மூடு',
    expand: 'விரிவாக்கு',
    collapse: 'சுருக்கு',
  },
  nav: {
    home: 'முகப்பு',
    advanced: 'மேம்பட்ட',
    benchmarks: 'அளவுகோல்கள்',
    report: 'அறிக்கை',
    profile: 'சுயவிவரம்',
    logout: 'வெளியேறு',
  },
  business: {
    mrr: 'மாதாந்திர வருவாய்',
    revenue: 'வருவாய்',
    expenses: 'செலவுகள்',
    profit: 'லாபம்',
    growth: 'வளர்ச்சி விகிதம்',
    runway: 'ரன்வே',
    burnRate: 'பர்ன் ரேட்',
    teamSize: 'குழு அளவு',
    industry: 'தொழில்',
    location: 'இடம்',
    founded: 'நிறுவப்பட்டது',
  },
  gst: {
    title: 'ஜிஎஸ்டி இணக்கம்',
    compliance: 'இணக்க மதிப்பெண்',
    filingStatus: 'தாக்கல் நிலை',
    pendingReturns: 'நிலுவை ரிட்டர்ன்கள்',
    inputTax: 'உள்ளீட்டு வரி கிரெடிட்',
    outputTax: 'வெளியீட்டு வரி',
    netPayable: 'நிகர ஜிஎஸ்டி செலுத்த வேண்டியவை',
    itcBalance: 'ஐடிசி இருப்பு',
    gstr1: 'ஜிஎஸ்டிஆர்-1',
    gstr3b: 'ஜிஎஸ்டிஆர்-3பி',
    dueDate: 'நிலுவை தேதி',
    filed: 'தாக்கல் செய்யப்பட்டது',
    pending: 'நிலுவையில்',
    overdue: 'தாமதம்',
  },
  funding: {
    title: 'நிதி தயார்நிலை',
    readinessScore: 'தயார்நிலை மதிப்பெண்',
    stage: 'பரிந்துரைக்கப்பட்ட நிலை',
    valuation: 'மதிப்பீடு',
    investors: 'முதலீட்டாளர்கள்',
    preSeed: 'ப்ரீ-சீட்',
    seed: 'சீட்',
    seriesA: 'சீரீஸ் A',
    seriesB: 'சீரீஸ் B',
    strengths: 'பலங்கள்',
    improvements: 'மேம்படுத்த வேண்டியவை',
  },
  market: {
    title: 'சந்தை நுழைவு',
    targetState: 'இலக்கு மாநிலம்',
    marketSize: 'சந்தை அளவு',
    regulatoryEase: 'ஒழுங்குமுறை எளிமை',
    infrastructure: 'உள்கட்டமைப்பு',
    digitalPenetration: 'டிஜிட்டல் ஊடுருவல்',
    roi: 'எதிர்பார்க்கப்படும் ROI',
    riskFactors: 'ஆபத்து காரணிகள்',
    entryStrategy: 'நுழைவு உத்தி',
    breakeven: 'பிரேக்-ஈவன் காலம்',
  },
  cashflow: {
    title: 'பணப்புழக்கம்',
    balance: 'தற்போதைய இருப்பு',
    inflow: 'உள்வரவு',
    outflow: 'வெளியேற்றம்',
    projection: 'கணிப்பு',
    days30: '30 நாட்கள்',
    days60: '60 நாட்கள்',
    days90: '90 நாட்கள்',
    runway: 'ரன்வே',
    alerts: 'எச்சரிக்கைகள்',
  },
  workforce: {
    title: 'பணியாளர் திட்டமிடல்',
    currentStaff: 'தற்போதைய ஊழியர்கள்',
    required: 'தேவை',
    gap: 'இடைவெளி',
    hiring: 'பணியமர்த்தல் திட்டம்',
    roles: 'தேவையான பணிகள்',
    priority: 'முன்னுரிமை',
    cost: 'மாத செலவு',
    timeline: 'பணியமர்த்தல் வரை',
    festivalImpact: 'திருவிழா தாக்கம்',
  },
  competitor: {
    title: 'போட்டியாளர் ஒப்பீடு',
    marketShare: 'சந்தை பங்கு',
    ranking: 'உங்கள் தரவரிசை',
    strengths: 'பலங்கள்',
    weaknesses: 'பலவீனங்கள்',
    benchmark: 'அளவுகோல் மதிப்பெண்',
    addCompetitor: 'போட்டியாளர் சேர்',
  },
  voice: {
    title: 'குரல் உள்ளீடு',
    tapToSpeak: 'பேச தட்டவும்',
    listening: 'கேட்கிறது...',
    tryCommands: 'சொல்ல முயற்சிக்கவும்',
    notSupported: 'குரல் ஆதரிக்கப்படவில்லை',
  },
  whatsapp: {
    title: 'வாட்ஸ்அப் பகிர்வு',
    shareReport: 'அறிக்கை பகிர்',
    directMessage: 'நேரடி செய்தி',
    shareLink: 'இணைப்பு பகிர்',
    phoneNumber: 'தொலைபேசி எண்',
    recentShares: 'சமீபத்திய பகிர்வுகள்',
  },
  excel: {
    title: 'எக்செல் ஏற்றுமதி',
    exportAll: 'அனைத்தையும் ஏற்றுமதி',
    exportSelected: 'தேர்ந்தெடுத்ததை ஏற்றுமதி',
    businessProfile: 'வணிக விவரம்',
    financialReport: 'நிதி அறிக்கை',
    competitorAnalysis: 'போட்டியாளர் பகுப்பாய்வு',
    roadmapDecisions: 'ரோட்மேப் முடிவுகள்',
  },
  integrations: {
    title: 'ஒருங்கிணைப்புகள்',
    tally: 'டேலி ERP',
    zoho: 'ஜோஹோ புக்ஸ்',
    gstPortal: 'ஜிஎஸ்டி போர்டல்',
    connected: 'இணைக்கப்பட்டது',
    disconnected: 'இணைக்கப்படவில்லை',
    configure: 'கட்டமை',
  },
  roadmap: {
    title: 'உத்தி ரோட்மேப்',
    decisions: 'முடிவுகள்',
    optimalPath: 'சிறந்த பாதை',
    yourPath: 'உங்கள் பாதை',
    matchScore: 'பொருத்த மதிப்பெண்',
    expectedRoi: 'எதிர்பார்க்கப்படும் ROI',
    timeline: 'காலவரிசை',
    aiRecommendation: 'AI பரிந்துரை',
  },
  alerts: {
    lowRunway: 'குறைந்த ரன்வே எச்சரிக்கை',
    gstDue: 'ஜிஎஸ்டி விரைவில் செலுத்த வேண்டும்',
    hiringNeeded: 'பணியமர்த்தல் தேவை',
    supplierRisk: 'சப்ளையர் ஆபத்து',
    cashflowWarning: 'பணப்புழக்க எச்சரிக்கை',
  },
};

// Marathi Translations
const mr: Translations = {
  common: {
    dashboard: 'डॅशबोर्ड',
    reports: 'अहवाल',
    settings: 'सेटिंग्ज',
    export: 'निर्यात',
    share: 'शेअर करा',
    save: 'जतन करा',
    cancel: 'रद्द करा',
    submit: 'सबमिट करा',
    loading: 'लोड होत आहे...',
    error: 'त्रुटी',
    success: 'यशस्वी',
    search: 'शोधा',
    filter: 'फिल्टर',
    viewAll: 'सर्व पहा',
    close: 'बंद करा',
    expand: 'विस्तार करा',
    collapse: 'संक्षिप्त करा',
  },
  nav: {
    home: 'मुख्यपृष्ठ',
    advanced: 'प्रगत',
    benchmarks: 'बेंचमार्क',
    report: 'अहवाल',
    profile: 'प्रोफाइल',
    logout: 'लॉगआउट',
  },
  business: {
    mrr: 'मासिक आवर्ती महसूल',
    revenue: 'महसूल',
    expenses: 'खर्च',
    profit: 'नफा',
    growth: 'वाढीचा दर',
    runway: 'रनवे',
    burnRate: 'बर्न रेट',
    teamSize: 'टीमचा आकार',
    industry: 'उद्योग',
    location: 'स्थान',
    founded: 'स्थापित',
  },
  gst: {
    title: 'जीएसटी अनुपालन',
    compliance: 'अनुपालन स्कोअर',
    filingStatus: 'फाइलिंग स्थिती',
    pendingReturns: 'प्रलंबित रिटर्न',
    inputTax: 'इनपुट टॅक्स क्रेडिट',
    outputTax: 'आउटपुट टॅक्स',
    netPayable: 'निव्वळ जीएसटी देय',
    itcBalance: 'आयटीसी शिल्लक',
    gstr1: 'जीएसटीआर-1',
    gstr3b: 'जीएसटीआर-3बी',
    dueDate: 'देय तारीख',
    filed: 'दाखल',
    pending: 'प्रलंबित',
    overdue: 'थकबाकी',
  },
  funding: {
    title: 'फंडिंग तयारी',
    readinessScore: 'तयारी स्कोअर',
    stage: 'शिफारस केलेला टप्पा',
    valuation: 'अंदाजे मूल्यांकन',
    investors: 'संभाव्य गुंतवणूकदार',
    preSeed: 'प्री-सीड',
    seed: 'सीड',
    seriesA: 'सीरीज A',
    seriesB: 'सीरीज B',
    strengths: 'सामर्थ्य',
    improvements: 'सुधारणा आवश्यक',
  },
  market: {
    title: 'बाजार प्रवेश',
    targetState: 'लक्ष्य राज्य',
    marketSize: 'बाजाराचा आकार',
    regulatoryEase: 'नियामक सुलभता',
    infrastructure: 'पायाभूत सुविधा',
    digitalPenetration: 'डिजिटल प्रवेश',
    roi: 'अपेक्षित ROI',
    riskFactors: 'जोखीम घटक',
    entryStrategy: 'प्रवेश रणनीती',
    breakeven: 'ब्रेक-इव्हन टाइमलाइन',
  },
  cashflow: {
    title: 'रोख प्रवाह',
    balance: 'सध्याची शिल्लक',
    inflow: 'आवक',
    outflow: 'जावक',
    projection: 'अंदाज',
    days30: '30 दिवस',
    days60: '60 दिवस',
    days90: '90 दिवस',
    runway: 'रनवे',
    alerts: 'सूचना',
  },
  workforce: {
    title: 'कर्मचारी नियोजन',
    currentStaff: 'सध्याचे कर्मचारी',
    required: 'आवश्यक',
    gap: 'अंतर',
    hiring: 'भरती योजना',
    roles: 'आवश्यक भूमिका',
    priority: 'प्राधान्य',
    cost: 'मासिक खर्च',
    timeline: 'भरती पर्यंत',
    festivalImpact: 'सणाचा प्रभाव',
  },
  competitor: {
    title: 'स्पर्धक बेंचमार्क',
    marketShare: 'बाजार वाटा',
    ranking: 'तुमची रँकिंग',
    strengths: 'सामर्थ्ये',
    weaknesses: 'कमकुवतपणा',
    benchmark: 'बेंचमार्क स्कोअर',
    addCompetitor: 'स्पर्धक जोडा',
  },
  voice: {
    title: 'आवाज इनपुट',
    tapToSpeak: 'बोलण्यासाठी टॅप करा',
    listening: 'ऐकत आहे...',
    tryCommands: 'बोलून पहा',
    notSupported: 'आवाज समर्थित नाही',
  },
  whatsapp: {
    title: 'व्हाट्सअॅप शेअर',
    shareReport: 'अहवाल शेअर करा',
    directMessage: 'थेट संदेश',
    shareLink: 'लिंक शेअर करा',
    phoneNumber: 'फोन नंबर',
    recentShares: 'अलीकडील शेअर',
  },
  excel: {
    title: 'एक्सेल निर्यात',
    exportAll: 'सर्व निर्यात करा',
    exportSelected: 'निवडलेले निर्यात करा',
    businessProfile: 'व्यवसाय प्रोफाइल',
    financialReport: 'आर्थिक अहवाल',
    competitorAnalysis: 'स्पर्धक विश्लेषण',
    roadmapDecisions: 'रोडमॅप निर्णय',
  },
  integrations: {
    title: 'एकत्रीकरण',
    tally: 'टॅली ERP',
    zoho: 'झोहो बुक्स',
    gstPortal: 'जीएसटी पोर्टल',
    connected: 'जोडलेले',
    disconnected: 'जोडलेले नाही',
    configure: 'कॉन्फिगर करा',
  },
  roadmap: {
    title: 'रणनीती रोडमॅप',
    decisions: 'निर्णय',
    optimalPath: 'इष्टतम मार्ग',
    yourPath: 'तुमचा मार्ग',
    matchScore: 'मॅच स्कोअर',
    expectedRoi: 'अपेक्षित ROI',
    timeline: 'टाइमलाइन',
    aiRecommendation: 'AI शिफारस',
  },
  alerts: {
    lowRunway: 'कमी रनवे इशारा',
    gstDue: 'जीएसटी लवकरच देय',
    hiringNeeded: 'भरती आवश्यक',
    supplierRisk: 'पुरवठादार जोखीम',
    cashflowWarning: 'रोख प्रवाह इशारा',
  },
};

// Bengali Translations
const bn: Translations = {
  common: {
    dashboard: 'ড্যাশবোর্ড',
    reports: 'রিপোর্ট',
    settings: 'সেটিংস',
    export: 'এক্সপোর্ট',
    share: 'শেয়ার',
    save: 'সংরক্ষণ',
    cancel: 'বাতিল',
    submit: 'জমা দিন',
    loading: 'লোড হচ্ছে...',
    error: 'ত্রুটি',
    success: 'সফল',
    search: 'অনুসন্ধান',
    filter: 'ফিল্টার',
    viewAll: 'সব দেখুন',
    close: 'বন্ধ',
    expand: 'বিস্তারিত',
    collapse: 'সংক্ষিপ্ত',
  },
  nav: {
    home: 'হোম',
    advanced: 'উন্নত',
    benchmarks: 'বেঞ্চমার্ক',
    report: 'রিপোর্ট',
    profile: 'প্রোফাইল',
    logout: 'লগআউট',
  },
  business: {
    mrr: 'মাসিক পুনরাবৃত্ত রাজস্ব',
    revenue: 'রাজস্ব',
    expenses: 'ব্যয়',
    profit: 'লাভ',
    growth: 'বৃদ্ধির হার',
    runway: 'রানওয়ে',
    burnRate: 'বার্ন রেট',
    teamSize: 'দলের আকার',
    industry: 'শিল্প',
    location: 'অবস্থান',
    founded: 'প্রতিষ্ঠিত',
  },
  gst: {
    title: 'জিএসটি সম্মতি',
    compliance: 'সম্মতি স্কোর',
    filingStatus: 'ফাইলিং স্থিতি',
    pendingReturns: 'মুলতুবি রিটার্ন',
    inputTax: 'ইনপুট ট্যাক্স ক্রেডিট',
    outputTax: 'আউটপুট ট্যাক্স',
    netPayable: 'নেট জিএসটি প্রদেয়',
    itcBalance: 'আইটিসি ব্যালেন্স',
    gstr1: 'জিএসটিআর-1',
    gstr3b: 'জিএসটিআর-3বি',
    dueDate: 'নির্ধারিত তারিখ',
    filed: 'দাখিল',
    pending: 'মুলতুবি',
    overdue: 'বকেয়া',
  },
  funding: {
    title: 'ফান্ডিং প্রস্তুতি',
    readinessScore: 'প্রস্তুতি স্কোর',
    stage: 'সুপারিশকৃত পর্যায়',
    valuation: 'আনুমানিক মূল্যায়ন',
    investors: 'সম্ভাব্য বিনিয়োগকারী',
    preSeed: 'প্রি-সিড',
    seed: 'সিড',
    seriesA: 'সিরিজ A',
    seriesB: 'সিরিজ B',
    strengths: 'শক্তি',
    improvements: 'উন্নতির ক্ষেত্র',
  },
  market: {
    title: 'বাজার প্রবেশ',
    targetState: 'লক্ষ্য রাজ্য',
    marketSize: 'বাজারের আকার',
    regulatoryEase: 'নিয়ন্ত্রক সহজতা',
    infrastructure: 'অবকাঠামো',
    digitalPenetration: 'ডিজিটাল প্রবেশ',
    roi: 'প্রত্যাশিত ROI',
    riskFactors: 'ঝুঁকির কারণ',
    entryStrategy: 'প্রবেশ কৌশল',
    breakeven: 'ব্রেক-ইভেন সময়সীমা',
  },
  cashflow: {
    title: 'নগদ প্রবাহ',
    balance: 'বর্তমান ব্যালেন্স',
    inflow: 'আয়',
    outflow: 'ব্যয়',
    projection: 'প্রক্ষেপণ',
    days30: '30 দিন',
    days60: '60 দিন',
    days90: '90 দিন',
    runway: 'রানওয়ে',
    alerts: 'সতর্কতা',
  },
  workforce: {
    title: 'কর্মী পরিকল্পনা',
    currentStaff: 'বর্তমান কর্মী',
    required: 'প্রয়োজন',
    gap: 'ব্যবধান',
    hiring: 'নিয়োগ পরিকল্পনা',
    roles: 'প্রয়োজনীয় ভূমিকা',
    priority: 'অগ্রাধিকার',
    cost: 'মাসিক খরচ',
    timeline: 'নিয়োগ পর্যন্ত',
    festivalImpact: 'উৎসব প্রভাব',
  },
  competitor: {
    title: 'প্রতিযোগী বেঞ্চমার্ক',
    marketShare: 'বাজার শেয়ার',
    ranking: 'আপনার র‍্যাঙ্কিং',
    strengths: 'শক্তি',
    weaknesses: 'দুর্বলতা',
    benchmark: 'বেঞ্চমার্ক স্কোর',
    addCompetitor: 'প্রতিযোগী যোগ করুন',
  },
  voice: {
    title: 'ভয়েস ইনপুট',
    tapToSpeak: 'বলতে ট্যাপ করুন',
    listening: 'শুনছি...',
    tryCommands: 'বলার চেষ্টা করুন',
    notSupported: 'ভয়েস সমর্থিত নয়',
  },
  whatsapp: {
    title: 'হোয়াটসঅ্যাপ শেয়ার',
    shareReport: 'রিপোর্ট শেয়ার',
    directMessage: 'সরাসরি বার্তা',
    shareLink: 'লিঙ্ক শেয়ার',
    phoneNumber: 'ফোন নম্বর',
    recentShares: 'সাম্প্রতিক শেয়ার',
  },
  excel: {
    title: 'এক্সেল এক্সপোর্ট',
    exportAll: 'সব এক্সপোর্ট',
    exportSelected: 'নির্বাচিত এক্সপোর্ট',
    businessProfile: 'ব্যবসায়িক প্রোফাইল',
    financialReport: 'আর্থিক রিপোর্ট',
    competitorAnalysis: 'প্রতিযোগী বিশ্লেষণ',
    roadmapDecisions: 'রোডম্যাপ সিদ্ধান্ত',
  },
  integrations: {
    title: 'ইন্টিগ্রেশন',
    tally: 'ট্যালি ERP',
    zoho: 'জোহো বুকস',
    gstPortal: 'জিএসটি পোর্টাল',
    connected: 'সংযুক্ত',
    disconnected: 'সংযুক্ত নয়',
    configure: 'কনফিগার',
  },
  roadmap: {
    title: 'কৌশল রোডম্যাপ',
    decisions: 'সিদ্ধান্ত',
    optimalPath: 'সর্বোত্তম পথ',
    yourPath: 'আপনার পথ',
    matchScore: 'ম্যাচ স্কোর',
    expectedRoi: 'প্রত্যাশিত ROI',
    timeline: 'সময়সীমা',
    aiRecommendation: 'AI সুপারিশ',
  },
  alerts: {
    lowRunway: 'কম রানওয়ে সতর্কতা',
    gstDue: 'জিএসটি শীঘ্রই দেয়',
    hiringNeeded: 'নিয়োগ প্রয়োজন',
    supplierRisk: 'সরবরাহকারী ঝুঁকি',
    cashflowWarning: 'নগদ প্রবাহ সতর্কতা',
  },
};

// Telugu Translations
const te: Translations = {
  common: {
    dashboard: 'డాష్‌బోర్డ్',
    reports: 'నివేదికలు',
    settings: 'సెట్టింగ్‌లు',
    export: 'ఎగుమతి',
    share: 'షేర్',
    save: 'సేవ్',
    cancel: 'రద్దు',
    submit: 'సమర్పించు',
    loading: 'లోడ్ అవుతోంది...',
    error: 'లోపం',
    success: 'విజయం',
    search: 'శోధన',
    filter: 'ఫిల్టర్',
    viewAll: 'అన్నీ చూడండి',
    close: 'మూసివేయి',
    expand: 'విస్తరించు',
    collapse: 'కుదించు',
  },
  nav: {
    home: 'హోమ్',
    advanced: 'అధునాతన',
    benchmarks: 'బెంచ్‌మార్క్‌లు',
    report: 'నివేదిక',
    profile: 'ప్రొఫైల్',
    logout: 'లాగ్‌అవుట్',
  },
  business: {
    mrr: 'నెలవారీ ఆవర్తన ఆదాయం',
    revenue: 'ఆదాయం',
    expenses: 'ఖర్చులు',
    profit: 'లాభం',
    growth: 'వృద్ధి రేటు',
    runway: 'రన్‌వే',
    burnRate: 'బర్న్ రేట్',
    teamSize: 'బృంద పరిమాణం',
    industry: 'పరిశ్రమ',
    location: 'ప్రదేశం',
    founded: 'స్థాపించబడింది',
  },
  gst: {
    title: 'జీఎస్‌టీ సమ్మతి',
    compliance: 'సమ్మతి స్కోర్',
    filingStatus: 'ఫైలింగ్ స్థితి',
    pendingReturns: 'పెండింగ్ రిటర్న్‌లు',
    inputTax: 'ఇన్‌పుట్ ట్యాక్స్ క్రెడిట్',
    outputTax: 'అవుట్‌పుట్ ట్యాక్స్',
    netPayable: 'నెట్ జీఎస్‌టీ చెల్లింపు',
    itcBalance: 'ఐటీసీ బ్యాలెన్స్',
    gstr1: 'జీఎస్‌టీఆర్-1',
    gstr3b: 'జీఎస్‌టీఆర్-3బీ',
    dueDate: 'గడువు తేదీ',
    filed: 'దాఖలు చేయబడింది',
    pending: 'పెండింగ్',
    overdue: 'ఆలస్యం',
  },
  funding: {
    title: 'ఫండింగ్ సన్నద్ధత',
    readinessScore: 'సన్నద్ధత స్కోర్',
    stage: 'సిఫార్సు చేసిన దశ',
    valuation: 'అంచనా విలువ',
    investors: 'సంభావ్య పెట్టుబడిదారులు',
    preSeed: 'ప్రీ-సీడ్',
    seed: 'సీడ్',
    seriesA: 'సీరీస్ A',
    seriesB: 'సీరీస్ B',
    strengths: 'బలాలు',
    improvements: 'మెరుగుపరచాల్సిన అంశాలు',
  },
  market: {
    title: 'మార్కెట్ ప్రవేశం',
    targetState: 'లక్ష్య రాష్ట్రం',
    marketSize: 'మార్కెట్ పరిమాణం',
    regulatoryEase: 'నియంత్రణ సౌలభ్యం',
    infrastructure: 'మౌలిక సదుపాయాలు',
    digitalPenetration: 'డిజిటల్ వ్యాప్తి',
    roi: 'ఆశించిన ROI',
    riskFactors: 'ప్రమాద కారకాలు',
    entryStrategy: 'ప్రవేశ వ్యూహం',
    breakeven: 'బ్రేక్-ఈవెన్ కాలం',
  },
  cashflow: {
    title: 'నగదు ప్రవాహం',
    balance: 'ప్రస్తుత బ్యాలెన్స్',
    inflow: 'ఆదాయం',
    outflow: 'ఖర్చులు',
    projection: 'అంచనా',
    days30: '30 రోజులు',
    days60: '60 రోజులు',
    days90: '90 రోజులు',
    runway: 'రన్‌వే',
    alerts: 'హెచ్చరికలు',
  },
  workforce: {
    title: 'సిబ్బంది ప్రణాళిక',
    currentStaff: 'ప్రస్తుత సిబ్బంది',
    required: 'అవసరం',
    gap: 'అంతరం',
    hiring: 'నియామక ప్రణాళిక',
    roles: 'అవసరమైన పాత్రలు',
    priority: 'ప్రాధాన్యత',
    cost: 'నెలవారీ ఖర్చు',
    timeline: 'నియామకం వరకు',
    festivalImpact: 'పండుగ ప్రభావం',
  },
  competitor: {
    title: 'పోటీదారు బెంచ్‌మార్క్',
    marketShare: 'మార్కెట్ వాటా',
    ranking: 'మీ ర్యాంకింగ్',
    strengths: 'బలాలు',
    weaknesses: 'బలహీనతలు',
    benchmark: 'బెంచ్‌మార్క్ స్కోర్',
    addCompetitor: 'పోటీదారుని జోడించు',
  },
  voice: {
    title: 'వాయిస్ ఇన్‌పుట్',
    tapToSpeak: 'మాట్లాడటానికి ట్యాప్ చేయండి',
    listening: 'వింటోంది...',
    tryCommands: 'చెప్పడానికి ప్రయత్నించండి',
    notSupported: 'వాయిస్ మద్దతు లేదు',
  },
  whatsapp: {
    title: 'వాట్సాప్ షేర్',
    shareReport: 'నివేదిక షేర్ చేయి',
    directMessage: 'ప్రత్యక్ష సందేశం',
    shareLink: 'లింక్ షేర్ చేయి',
    phoneNumber: 'ఫోన్ నంబర్',
    recentShares: 'ఇటీవలి షేర్‌లు',
  },
  excel: {
    title: 'ఎక్సెల్ ఎగుమతి',
    exportAll: 'అన్నీ ఎగుమతి చేయి',
    exportSelected: 'ఎంపిక చేసినవి ఎగుమతి చేయి',
    businessProfile: 'వ్యాపార ప్రొఫైల్',
    financialReport: 'ఆర్థిక నివేదిక',
    competitorAnalysis: 'పోటీదారు విశ్లేషణ',
    roadmapDecisions: 'రోడ్‌మ్యాప్ నిర్ణయాలు',
  },
  integrations: {
    title: 'ఏకీకరణలు',
    tally: 'ట్యాలీ ERP',
    zoho: 'జోహో బుక్స్',
    gstPortal: 'జీఎస్‌టీ పోర్టల్',
    connected: 'కనెక్ట్ అయింది',
    disconnected: 'కనెక్ట్ కాలేదు',
    configure: 'కాన్ఫిగర్ చేయి',
  },
  roadmap: {
    title: 'వ్యూహ రోడ్‌మ్యాప్',
    decisions: 'నిర్ణయాలు',
    optimalPath: 'ఉత్తమ మార్గం',
    yourPath: 'మీ మార్గం',
    matchScore: 'మ్యాచ్ స్కోర్',
    expectedRoi: 'ఆశించిన ROI',
    timeline: 'కాలపరిమితి',
    aiRecommendation: 'AI సిఫార్సు',
  },
  alerts: {
    lowRunway: 'తక్కువ రన్‌వే హెచ్చరిక',
    gstDue: 'జీఎస్‌టీ త్వరలో చెల్లించాలి',
    hiringNeeded: 'నియామకం అవసరం',
    supplierRisk: 'సరఫరాదారు ప్రమాదం',
    cashflowWarning: 'నగదు ప్రవాహ హెచ్చరిక',
  },
};

// All translations
const translations: Record<SupportedLanguage, Translations> = { en, hi, ta, mr, bn, te };

// Get translation for a specific language
export function getTranslations(lang: SupportedLanguage): Translations {
  return translations[lang] || translations.en;
}

// Translation helper function
export function t(lang: SupportedLanguage, category: keyof Translations, key: string): string {
  const trans = translations[lang] || translations.en;
  const categoryTrans = trans[category] as Record<string, string>;
  return categoryTrans?.[key] || (translations.en[category] as Record<string, string>)?.[key] || key;
}

// Detect user's preferred language
export function detectLanguage(): SupportedLanguage {
  if (typeof navigator === 'undefined') return 'en';

  const browserLang = navigator.language.split('-')[0];
  const supported: SupportedLanguage[] = ['en', 'hi', 'ta', 'mr', 'bn', 'te'];

  if (supported.includes(browserLang as SupportedLanguage)) {
    return browserLang as SupportedLanguage;
  }

  return 'en';
}

// Format numbers in Indian style
export function formatIndianNumber(num: number, lang: SupportedLanguage = 'en'): string {
  const formatter = new Intl.NumberFormat(lang === 'en' ? 'en-IN' : `${lang}-IN`, {
    maximumFractionDigits: 2,
  });
  return formatter.format(num);
}

// Format currency in Indian Rupees
export function formatIndianCurrency(num: number, lang: SupportedLanguage = 'en'): string {
  if (num >= 10000000) {
    return `₹${formatIndianNumber(num / 10000000, lang)} Cr`;
  }
  if (num >= 100000) {
    return `₹${formatIndianNumber(num / 100000, lang)} L`;
  }
  return `₹${formatIndianNumber(num, lang)}`;
}
