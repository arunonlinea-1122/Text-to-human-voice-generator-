import { VoiceOption, StyleOption, LanguageKey } from '../types';

export const VOICES: VoiceOption[] = [
  {
    id: 'Kore',
    name: 'Kore',
    gender: 'female',
    nepaliTitle: 'कोरे (महिला - न्यानो र स्पष्ट)',
    englishTitle: 'Kore (Female - Warm & Clear)',
    descriptionNe: 'अति स्वाभाविक, शान्त र आत्मीय आवाज। कथा, अडियोबुक र सामान्य कुराकानीका लागि उपयुक्त।',
    descriptionEn: 'Soothing, gentle, and warm tone. Ideal for storytelling, audiobooks, and narration.',
    tag: 'लोकप्रिय / Recommended',
    tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    id: 'Zephyr',
    name: 'Zephyr',
    gender: 'female',
    nepaliTitle: 'जेफिर (महिला - ऊर्जावान र उज्यालो)',
    englishTitle: 'Zephyr (Female - Bright & Cheerful)',
    descriptionNe: 'हँसिलो, मित्रवत र चञ्चल आवाज। विज्ञापन, पोडकास्ट र भिडियोका लागि उत्तम।',
    descriptionEn: 'Bright, cheerful, and crisp conversational tone. Great for podcasts and commercial spots.',
    tag: 'जीवन्त / Lively',
    tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    id: 'Aoede',
    name: 'Aoede',
    gender: 'female',
    nepaliTitle: 'आयोडि (महिला - गहिरो र कलात्मक)',
    englishTitle: 'Aoede (Female - Expressive & Deep)',
    descriptionNe: 'भावनात्मक उतारचढाव भएको कलात्मक आवाज। साहित्य, कविता र गम्भीर कुराकानीका लागि।',
    descriptionEn: 'Rich, melodic, and expressive tone. Superb for emotional drama, poetry, and literature.',
    tag: 'भावुक / Expressive',
    tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  {
    id: 'Puck',
    name: 'Puck',
    gender: 'male',
    nepaliTitle: 'पक (पुरुष - युवा र ऊर्जाशील)',
    englishTitle: 'Puck (Male - Youthful & Dynamic)',
    descriptionNe: 'उत्साही, युवा र ताजा केटोको जस्तो आवाज। युट्युब भिडियो, ब्लग र रमाइलो कुराकानीका लागि।',
    descriptionEn: 'Youthful, vibrant, and engaging. Excellent for modern social content, vlogs, and gaming.',
    tag: 'युवा / Dynamic',
    tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    id: 'Charon',
    name: 'Charon',
    gender: 'male',
    nepaliTitle: 'क्यारन (पुरुष - गहिरो र शान्त)',
    englishTitle: 'Charon (Male - Deep & Resonant)',
    descriptionNe: 'गम्भीर, न्यानो र विश्वासिलो पुरुष स्वर। डकुमेन्ट्री, ध्यान र उत्प्रेरणाका लागि।',
    descriptionEn: 'Deep, resonant, and calm timbre. Perfect for documentaries, meditation, and leadership talks.',
    tag: 'गम्भीर / Resonant',
    tagColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
  {
    id: 'Fenrir',
    name: 'Fenrir',
    gender: 'male',
    nepaliTitle: 'फेन्रिर (पुरुष - दृढ र औपचारिक)',
    englishTitle: 'Fenrir (Male - Authoritative & Crisp)',
    descriptionNe: 'स्पष्ट, दृढ र समाचार वाचन शैलीको आवाज। समाचार, व्यापारिक प्रस्तुति र निर्देशनका लागि।',
    descriptionEn: 'Authoritative, strong, and articulate delivery. Great for news broadcasts and presentations.',
    tag: 'औपचारिक / Formal',
    tagColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  },
];

export const STYLES: StyleOption[] = [
  {
    id: 'natural',
    labelNe: 'स्वाभाविक मानव (बोलचाल)',
    labelEn: 'Natural Human (Conversational)',
    descriptionNe: 'मान्छेले आफ्नै साथीसँग बोलेजस्तै स्वाभाविक र न्यानो ताल।',
    descriptionEn: 'Authentic conversational pacing with organic breath and pauses.',
    iconName: 'MessageCircle',
  },
  {
    id: 'storyteller',
    labelNe: 'कथा वाचक (भावनात्मक)',
    labelEn: 'Storyteller (Emotional)',
    descriptionNe: 'शब्दपिच्छे भावना र उतारचढाव दिने जीवन्त कथा शैली।',
    descriptionEn: 'Immersive storytelling with dramatic cadence and deep emotion.',
    iconName: 'BookOpen',
  },
  {
    id: 'news',
    labelNe: 'समाचार वाचक (स्पष्ट र औपचारिक)',
    labelEn: 'News Broadcast (Clear & Formal)',
    descriptionNe: 'रेडियो वा टेलिभिजन समाचार प्रस्तोता जस्तो छिटो र छरितो बोली।',
    descriptionEn: 'Crisp, articulate, professional journalism style.',
    iconName: 'Radio',
  },
  {
    id: 'friendly',
    labelNe: 'मित्रवत र मुस्कुराउँदो',
    labelEn: 'Friendly & Cheerful',
    descriptionNe: 'मुस्कुराएर स्वागत गरेजस्तो मीठो र आदरयुक्त बोली।',
    descriptionEn: 'Warm, smiling, polite, and uplifting delivery.',
    iconName: 'Smile',
  },
  {
    id: 'meditative',
    labelNe: 'शान्त र ध्यानमग्न',
    labelEn: 'Calm & Meditative',
    descriptionNe: 'मन शान्त बनाउने मन्द, धीमा र आनन्ददायी आवाज।',
    descriptionEn: 'Gentle, soothing, whisper-soft contemplative cadence.',
    iconName: 'Sparkles',
  },
  {
    id: 'energetic',
    labelNe: 'उत्साही र प्रेरणादायी',
    labelEn: 'Energetic & Inspiring',
    descriptionNe: 'जोसिलो, हौसला दिने र उच्च मनोबलको बोली।',
    descriptionEn: 'High energy, motivational, and confident pacing.',
    iconName: 'Zap',
  },
];

export interface SampleText {
  id: string;
  lang: LanguageKey;
  title: string;
  text: string;
  recommendedVoice: string;
  recommendedStyle: string;
}

export const SAMPLE_TEXTS: SampleText[] = [
  {
    id: 'ne-1',
    lang: 'ne',
    title: 'नेपाली न्यानो अभिवादन (Warm Greeting)',
    text: 'नमस्ते साथी! <breath> तपाईंलाई कस्तो छ? आजको दिन तपाईंको लागि एकदमै सुखद र फलदायी रहोस्। जिन्दगीमा साना-साना खुसीहरूलाई बटुल्दै अगाडि बढ्नु नै साँचो जिन्दगी हो, होइन त?',
    recommendedVoice: 'Kore',
    recommendedStyle: 'natural',
  },
  {
    id: 'ne-2',
    lang: 'ne',
    title: 'नेपालको प्राकृतिक सौन्दर्य (Nature & Mountains)',
    text: 'हिमालको काखबाट बग्ने चिसो हावा र हरियाली डाँडाहरू... <breath> नेपालको यो अनुपम सौन्दर्यले जो कोहीको मन पनि लोभ्याउँछ। जब बिहानीको पहिलो किरण कञ्चनजङ्घा र सगरमाथामा ठोकिन्छ, तब लाग्छ, संसारको स्वर्ग यहीं छ।',
    recommendedVoice: 'Aoede',
    recommendedStyle: 'storyteller',
  },
  {
    id: 'ne-3',
    lang: 'ne',
    title: 'नेपाली समाचार हेडलाइन (News Anchor)',
    text: 'श्रोताहरू नमस्कार, आजको मुख्य समाचारमा तपाईंलाई स्वागत छ। आज देशैभर मौसम सामान्यतया सफा रहने जल तथा मौसम विज्ञान विभागले जनाएको छ। विकास निर्माणका कामहरूमा पारदर्शिता ल्याउन नयाँ डिजिटल प्रणाली लागु गरिने भएको छ।',
    recommendedVoice: 'Fenrir',
    recommendedStyle: 'news',
  },
  {
    id: 'hi-1',
    lang: 'hi',
    title: 'हिन्दी आत्मीय विचार (Soulful Hindi)',
    text: 'नमस्ते दोस्त, <breath> जिंदगी कभी-कभी हमें ऐसे मोड़ पर ला देती है, जहाँ हमें खुद को थोड़ा वक्त देना पड़ता है। |yeah| कभी ठहरकर मुस्कुराइए, क्योंकि हर नया दिन अपने साथ एक नई उम्मीद लेकर आता है।',
    recommendedVoice: 'Kore',
    recommendedStyle: 'natural',
  },
  {
    id: 'hi-2',
    lang: 'hi',
    title: 'हिन्दी प्रेरणा और जीवन (Motivational Hindi)',
    text: 'जब तक आप खुद पर विश्वास नहीं करेंगे, तब तक दुनिया भी आप पर भरोसा नहीं करेगी। <breath> मुश्किलें रास्ते में आती रहेंगी, लेकिन आपका दृढ़ संकल्प ही आपको मंजिल तक ले जाएगा। आगे बढ़िए और अपने सपनों को सच कीजिए!',
    recommendedVoice: 'Charon',
    recommendedStyle: 'energetic',
  },
  {
    id: 'en-1',
    lang: 'en',
    title: 'English Story & Reflection',
    text: 'Welcome back. <breath> You know, life isn’t always about rushing to the finish line. Sometimes, the most profound moments happen when we simply slow down, listen to the whisper of the trees, and take it all in. |yeah| It’s truly wonderful.',
    recommendedVoice: 'Zephyr',
    recommendedStyle: 'natural',
  },
  {
    id: 'en-2',
    lang: 'en',
    title: 'English Tech & Innovation',
    text: 'Good morning everyone! <breath> Today we are witnessing an unprecedented revolution in real-time artificial intelligence. From natural voice synthesis to creative intelligence, the boundaries of technology are expanding faster than ever before.',
    recommendedVoice: 'Puck',
    recommendedStyle: 'energetic',
  },
];

export const VOCAL_TAGS = [
  { tag: '<breath>', label: 'सास फेर्ने (Breath)', desc: 'स्वाभाविक रूपमा सास तानेको आवाज' },
  { tag: '<laugh>', label: 'हाँसो/मुस्कान (Laugh)', desc: 'हल्का हाँस्दै बोल्ने' },
  { tag: '<gasp>', label: 'आश्चर्य (Gasp)', desc: 'चकित वा अचम्म परेको भाव' },
  { tag: '|mhm|', label: 'हुँ/अहँ (Backchannel)', desc: 'कुरा सुनिरहँदा आउने स्वाभाविक सहमति' },
  { tag: '|yeah|', label: 'हो नि (Yeah)', desc: 'कुराकानीको जीवन्त सहमति' },
];
