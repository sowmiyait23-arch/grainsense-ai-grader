import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ta";

/**
 * All UI strings live here. Add a new language by adding a key to `translations`
 * and to `languages` — no component changes required.
 */
export const languages: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ta", label: "தமிழ்" },
];

const en = {
  "app.name": "GrainSense AI",
  "app.tagline": "AI paddy grain quality grading",
  "nav.home": "Home",
  "nav.analyze": "Analyze",
  "nav.history": "History",

  "hero.badge": "MSME Idea Hackathon 5.0",
  "hero.title": "Grade your paddy in seconds, not hours",
  "hero.subtitle":
    "Manual grain grading is slow, inconsistent and subjective. GrainSense AI combines CNN-based visual defect analysis with an embedded moisture sensor to give farmers, FPOs and procurement centres one instant, objective quality report.",
  "hero.cta": "Try it now",
  "hero.secondary": "See past scans",
  "hero.imageAlt": "Golden paddy grains on natural linen",

  "problem.title": "Why grading needs to change",
  "problem.1.title": "Slow manual sampling",
  "problem.1.body": "Hand sorting a sample takes 20–30 minutes per lot at the procurement gate.",
  "problem.2.title": "Subjective judgement",
  "problem.2.body": "Two inspectors often grade the same lot differently, causing disputes over price.",
  "problem.3.title": "Moisture guesswork",
  "problem.3.body": "Storage losses happen when paddy above 14% moisture is bagged as safe.",

  "how.title": "How it works",
  "how.subtitle": "Three steps, under a minute.",
  "how.1.title": "Upload or capture",
  "how.1.body": "Spread a sample, take a photo with your phone or drop an image in.",
  "how.2.title": "AI analyzes",
  "how.2.body": "The CNN model detects broken, chalky, immature grains and foreign matter.",
  "how.3.title": "Get graded report",
  "how.3.body": "Grade, defect breakdown, moisture safety and a shareable summary card.",

  "upload.title": "Upload & analyze",
  "upload.subtitle": "Photo of the grain sample plus a moisture reading gives the best accuracy.",
  "upload.drop": "Drag & drop a grain sample photo",
  "upload.or": "or",
  "upload.browse": "Choose file",
  "upload.camera": "Use camera",
  "upload.change": "Replace photo",
  "upload.moisture": "Moisture level (%)",
  "upload.moistureHint": "Enter the sensor reading. Hardware sensor integration coming soon.",
  "upload.fetch": "Read sensor",
  "upload.analyze": "Analyze sample",
  "upload.analyzing": "Analyzing…",
  "upload.needImage": "Please add a photo of the grain sample first.",
  "upload.needMoisture": "Please enter a moisture value between 5 and 30%.",
  "upload.failed": "Analysis failed. Please try again.",

  "result.title": "Quality report",
  "result.grade": "Overall grade",
  "result.qualified": "Healthy",
  "result.notQualified": "Not healthy",
  "result.verdict": "Verdict",
  "result.healthyBody": "This sample is healthy — good to store or sell.",
  "result.notHealthyBody": "This sample is not healthy — check defects and dry it before storage.",
  "result.score": "Combined quality score",
  "result.defects": "Defect breakdown",
  "result.broken": "Broken grains",
  "result.chalky": "Chalky / discoloured",
  "result.foreign": "Foreign matter",
  "result.immature": "Immature grains",
  "result.moisture": "Moisture level",
  "result.safe": "Safe for storage",
  "result.unsafe": "Above safe limit — dry before storage",
  "result.threshold": "Safe storage limit: 14%",
  "result.sample": "Sample image",
  "result.download": "Download / print report",
  "result.share": "Share",
  "result.new": "Analyze another sample",
  "result.notFound": "Report not found.",
  "result.loading": "Loading report…",
  "result.recommend": "Recommendation",

  "history.title": "Scan history",
  "history.subtitle": "Every sample you have graded on this device.",
  "history.empty": "No scans yet. Analyze your first sample.",
  "history.filterGrade": "Filter by grade",
  "history.all": "All grades",
  "history.from": "From date",
  "history.clear": "Clear filters",
  "history.view": "View report",
  "history.loading": "Loading scans…",

  "common.grade": "Grade",
  "common.moisture": "Moisture",
  "common.date": "Date",
  "common.back": "Back",
  "footer.note": "Prototype — CNN inference and moisture sensor endpoints are pluggable stubs.",
};

const ta: Record<keyof typeof en, string> = {
  "app.name": "GrainSense AI",
  "app.tagline": "AI நெல் தர மதிப்பீடு",
  "nav.home": "முகப்பு",
  "nav.analyze": "பகுப்பாய்வு",
  "nav.history": "வரலாறு",

  "hero.badge": "MSME ஐடியா ஹேக்கத்தான் 5.0",
  "hero.title": "நெல்லின் தரத்தை நிமிடங்களில் அல்ல, விநாடிகளில் அறியுங்கள்",
  "hero.subtitle":
    "கையால் தரம் பிரிப்பது மெதுவானது, ஒரே சீராக இல்லாதது, தனிநபர் கருத்தை சார்ந்தது. GrainSense AI, CNN அடிப்படையிலான காட்சி குறைபாடு பகுப்பாய்வையும் ஈரப்பதம் சென்சார் அளவீட்டையும் இணைத்து விவசாயிகள், FPO மற்றும் கொள்முதல் நிலையங்களுக்கு உடனடி தர அறிக்கை வழங்குகிறது.",
  "hero.cta": "இப்போது முயற்சிக்கவும்",
  "hero.secondary": "பழைய பரிசோதனைகள்",
  "hero.imageAlt": "இயற்கை துணியில் பொன்னிற நெல் மணிகள்",

  "problem.title": "ஏன் மாற்றம் தேவை",
  "problem.1.title": "மெதுவான கைமுறை சோதனை",
  "problem.1.body": "ஒரு மாதிரியை கையால் பிரிக்க 20–30 நிமிடங்கள் ஆகிறது.",
  "problem.2.title": "தனிநபர் கருத்து",
  "problem.2.body": "ஒரே மாதிரிக்கு இரு பரிசோதகர்கள் வெவ்வேறு தரம் தருவதால் விலை தகராறு.",
  "problem.3.title": "ஈரப்பதம் ஊகம்",
  "problem.3.body": "14%க்கு மேல் ஈரப்பதம் உள்ள நெல் சேமிப்பில் கெட்டுப்போகிறது.",

  "how.title": "எப்படி வேலை செய்கிறது",
  "how.subtitle": "மூன்று படிகள், ஒரு நிமிடத்திற்குள்.",
  "how.1.title": "படம் பதிவேற்றம்",
  "how.1.body": "மாதிரியை பரப்பி மொபைலில் புகைப்படம் எடுக்கவும் அல்லது பதிவேற்றவும்.",
  "how.2.title": "AI பகுப்பாய்வு",
  "how.2.body": "CNN மாதிரி உடைந்த, சுண்ணாம்பு, முதிராத மணிகள் மற்றும் கழிவுகளை கண்டறியும்.",
  "how.3.title": "தர அறிக்கை",
  "how.3.body": "தரம், குறைபாடு விவரம், ஈரப்பத பாதுகாப்பு மற்றும் பகிரக்கூடிய அறிக்கை.",

  "upload.title": "பதிவேற்றி பகுப்பாய்வு செய்க",
  "upload.subtitle": "மாதிரி புகைப்படம் மற்றும் ஈரப்பதம் அளவீடு சிறந்த துல்லியம் தரும்.",
  "upload.drop": "நெல் மாதிரி புகைப்படத்தை இழுத்து விடுங்கள்",
  "upload.or": "அல்லது",
  "upload.browse": "கோப்பைத் தேர்வு செய்க",
  "upload.camera": "கேமரா பயன்படுத்து",
  "upload.change": "படத்தை மாற்று",
  "upload.moisture": "ஈரப்பதம் (%)",
  "upload.moistureHint": "சென்சார் அளவீட்டை உள்ளிடவும். வன்பொருள் இணைப்பு விரைவில்.",
  "upload.fetch": "சென்சாரில் இருந்து பெறு",
  "upload.analyze": "மாதிரியை பகுப்பாய்வு செய்",
  "upload.analyzing": "பகுப்பாய்வு நடக்கிறது…",
  "upload.needImage": "முதலில் மாதிரி புகைப்படத்தை சேர்க்கவும்.",
  "upload.needMoisture": "5 முதல் 30% வரை ஈரப்பத மதிப்பை உள்ளிடவும்.",
  "upload.failed": "பகுப்பாய்வு தோல்வி. மீண்டும் முயற்சிக்கவும்.",

  "result.title": "தர அறிக்கை",
  "result.grade": "மொத்த தரம்",
  "result.qualified": "ஆரோக்கியமானது",
  "result.notQualified": "ஆரோக்கியமற்றது",
  "result.verdict": "முடிவு",
  "result.healthyBody": "இந்த மாதிரி ஆரோக்கியமானது — சேமிக்கவோ விற்கவோ ஏற்றது.",
  "result.notHealthyBody": "இந்த மாதிரி ஆரோக்கியமற்றது — குறைபாடுகளை பார்த்து சேமிப்பதற்கு முன் உலர்த்தவும்.",
  "result.score": "மொத்த தர மதிப்பெண்",
  "result.defects": "குறைபாடு விவரம்",
  "result.broken": "உடைந்த மணிகள்",
  "result.chalky": "சுண்ணாம்பு / நிறமாறிய",
  "result.foreign": "வெளிப்பொருள் கழிவு",
  "result.immature": "முதிராத மணிகள்",
  "result.moisture": "ஈரப்பதம்",
  "result.safe": "சேமிப்பிற்கு பாதுகாப்பானது",
  "result.unsafe": "பாதுகாப்பு அளவை மீறியது — உலர்த்தவும்",
  "result.threshold": "பாதுகாப்பான வரம்பு: 14%",
  "result.sample": "மாதிரி படம்",
  "result.download": "அறிக்கையை பதிவிறக்கு / அச்சிடு",
  "result.share": "பகிர்",
  "result.new": "மற்றொரு மாதிரி",
  "result.notFound": "அறிக்கை கிடைக்கவில்லை.",
  "result.loading": "அறிக்கை ஏற்றப்படுகிறது…",
  "result.recommend": "பரிந்துரை",

  "history.title": "பரிசோதனை வரலாறு",
  "history.subtitle": "இந்த சாதனத்தில் நீங்கள் பகுப்பாய்வு செய்த மாதிரிகள்.",
  "history.empty": "இதுவரை பரிசோதனை இல்லை. முதல் மாதிரியை பகுப்பாய்வு செய்யுங்கள்.",
  "history.filterGrade": "தரம் வாரியாக வடிகட்டு",
  "history.all": "அனைத்து தரங்கள்",
  "history.from": "தேதியில் இருந்து",
  "history.clear": "வடிகட்டியை நீக்கு",
  "history.view": "அறிக்கையை பார்",
  "history.loading": "ஏற்றப்படுகிறது…",

  "common.grade": "தரம்",
  "common.moisture": "ஈரப்பதம்",
  "common.date": "தேதி",
  "common.back": "பின்செல்",
  "footer.note": "முன்மாதிரி — CNN மற்றும் சென்சார் இணைப்புகள் மாற்றக்கூடிய stubs.",
};

export const translations: Record<Lang, Record<string, string>> = { en, ta };

export type TranslationKey = keyof typeof en;

type I18nValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = "grainsense.lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && stored in translations) setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key] ?? translations.en[key] ?? key,
    [lang],
  );

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
