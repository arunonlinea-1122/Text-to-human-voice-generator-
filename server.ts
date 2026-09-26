import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Converts raw PCM 16-bit audio into a standard RIFF WAV buffer
 */
function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitDepth = 16): Buffer {
  const byteRate = sampleRate * numChannels * (bitDepth / 8);
  const blockAlign = numChannels * (bitDepth / 8);
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

/**
 * TTS Generation Route using gemini-3.8-flash-tts
 */
app.post('/api/tts/generate', async (req, res) => {
  try {
    const {
      text,
      language = 'ne', // 'ne' (Nepali), 'hi' (Hindi), 'en' (English), 'auto'
      voice = 'Kore',
      style = 'natural',
      customStylePrompt = '',
      speed = 1.0,
      pitch = 'normal',
      isDialogue = false,
      dialogueSpeakers = [],
    } = req.body;

    if (!text && (!dialogueSpeakers || dialogueSpeakers.length === 0)) {
      return res.status(400).json({ error: 'Text is required for speech synthesis' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets configuration.',
      });
    }

    // Build realistic human voice style directions tailored to the target language and emotion
    let styleDirection = '';
    const langMap: Record<string, string> = {
      ne: 'Authentic Nepali native pronunciation, crystal-clear phonetics, warm and emotional human cadence',
      hi: 'Authentic Hindi native accent with nuanced shudh/colloquial expression and lifelike pauses',
      en: 'Clear, articulate, natural human English pronunciation with expressive intonation',
      auto: 'Natural, highly realistic human pronunciation matching the language of the text with organic breath and pauses',
    };

    const styleDescriptors: Record<string, string> = {
      natural: 'Natural, warm, engaging human voice with conversational micro-pauses and expressive pitch variations.',
      storyteller: 'Expressive storyteller tone, deep emotive nuances, dramatic pacing and vivid atmosphere.',
      news: 'Clear, professional, authoritative broadcast journalist delivery with crisp articulation and steady rhythm.',
      friendly: 'Cheerful, warm, friendly and polite conversational tone with a smiling vocal brightness.',
      meditative: 'Soft, calm, serene and soothing tone with gentle, relaxed breathing pauses.',
      energetic: 'Dynamic, lively, inspiring and spirited delivery with enthusiastic emphasis.',
      dramatic: 'Intense, deeply passionate and cinematic dramatic performance.',
    };

    const chosenLangStyle = langMap[language] || langMap.auto;
    const chosenVocalStyle = styleDescriptors[style] || styleDescriptors.natural;
    const finalStyle = customStylePrompt
      ? `${chosenLangStyle}. ${customStylePrompt}`
      : `${chosenLangStyle}. ${chosenVocalStyle}`;

    let response;

    if (isDialogue && Array.isArray(dialogueSpeakers) && dialogueSpeakers.length === 2) {
      // Dual-speaker dialogue with gemini-3.8-flash-tts
      const speaker1 = dialogueSpeakers[0];
      const speaker2 = dialogueSpeakers[1];

      const parts = dialogueSpeakers.flatMap((sp: any) =>
        (sp.lines || []).map((line: string) => ({
          text: `${sp.name}: ${line}`,
          speechMetadata: {
            speaker: sp.name,
            style: sp.style || finalStyle,
          },
        }))
      );

      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts: parts.length > 0 ? parts : [{ text: text, speechMetadata: { style: finalStyle } }],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            multiSpeakerVoiceConfig: {
              speakerVoiceConfigs: [
                {
                  speaker: speaker1.name,
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: speaker1.voice || 'Puck' },
                  },
                },
                {
                  speaker: speaker2.name,
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: speaker2.voice || 'Kore' },
                  },
                },
              ],
            },
          },
        },
      });
    } else {
      // Single speaker TTS
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text,
                speechMetadata: {
                  style: finalStyle,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
            },
          },
        },
      });
    }

    const candidate = response.candidates?.[0];
    const part = candidate?.content?.parts?.[0];

    if (!part || !part.inlineData?.data) {
      return res.status(500).json({
        error: 'No audio data received from Gemini TTS model. Please try a different text or voice.',
      });
    }

    const rawData = part.inlineData.data;
    const returnedMime = part.inlineData.mimeType || 'audio/pcm;rate=24000';

    // Parse sample rate if provided in mimeType
    let sampleRate = 24000;
    const rateMatch = returnedMime.match(/rate=(\d+)/);
    if (rateMatch && rateMatch[1]) {
      sampleRate = parseInt(rateMatch[1], 10);
    }

    const pcmBuffer = Buffer.from(rawData, 'base64');
    // Wrap raw PCM into standard WAV format for zero-dependency universal browser playback & download
    const wavBuffer = returnedMime.includes('wav') ? pcmBuffer : pcmToWav(pcmBuffer, sampleRate);
    const audioBase64 = wavBuffer.toString('base64');

    return res.json({
      audioUrl: `data:audio/wav;base64,${audioBase64}`,
      audioBase64,
      sampleRate,
      format: 'audio/wav',
      durationEstimated: Math.round((pcmBuffer.length / (sampleRate * 2)) * 10) / 10,
    });
  } catch (error: any) {
    console.error('Error generating speech:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to synthesize speech. Please check your text and try again.',
    });
  }
});

/**
 * Text Humanizer endpoint: adds natural human breath marks (<breath>),
 * pauses, vocal expressions (<laugh>, |mhm|, |yeah|) or expressive punctuation for lifelike delivery
 */
app.post('/api/tts/humanize', async (req, res) => {
  try {
    const { text, language = 'ne', style = 'natural' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `You are an expert voice actor director and phonetics specialist for realistic Text-to-Speech in Nepali, Hindi, and English.
Given the text below, enhance it for ultra-natural, realistic human speech using the Gemini 3.8 Flash TTS features.
Rules:
1. Preserve the EXACT original language, words, and meaning. Do not translate or change the meaning.
2. Intersperse natural speech punctuation (commas, em dashes, ellipses for thinking pauses) where a human would breathe or pause.
3. You may optionally insert subtle vocal burst tags like '<breath>' where deep pauses happen, or natural backchannels like '|yeah|' or '|mhm|' if suitable for natural flow.
4. Keep Nepali in Nepali Devanagari, Hindi in Hindi Devanagari, English in English.
5. Return ONLY the enhanced text string. No explanations, no markdown quotes.

Input Text:
${text}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const enhanced = response.text?.trim() || text;
    return res.json({ enhancedText: enhanced });
  } catch (err: any) {
    console.error('Error humanizing text:', err);
    // If fails, return original text safely
    return res.json({ enhancedText: req.body.text });
  }
});

// Serve frontend with Vite in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
