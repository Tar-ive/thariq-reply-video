import React, { useState, useRef, useEffect } from 'react';

interface VoiceoverProps {
  text: string;
  onStart?: () => void;
  onEnd?: () => void;
  onProgress?: (progress: number) => void;
  autoPlay?: boolean;
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

interface VoiceConfig {
  voice: SpeechSynthesisVoice | null;
  rate: number;
  pitch: number;
  volume: number;
}

const Voiceover: React.FC<VoiceoverProps> = ({
  text,
  onStart,
  onEnd,
  onProgress,
  autoPlay = false,
  voice = 'default',
  rate = 1.2, // Slightly faster for excitement
  pitch = 1.1, // Slightly higher for enthusiasm
  volume = 0.8
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Select best voice for excited, enthusiastic tone
      const preferredVoices = [
        'Google US English', // Clear and energetic
        'Microsoft Zira Desktop', // Enthusiastic
        'Alex', // Natural sounding
        'Samantha' // Expressive
      ];
      
      let bestVoice = null;
      for (const preferred of preferredVoices) {
        bestVoice = availableVoices.find(v => 
          v.name.includes(preferred) && v.lang.startsWith('en')
        );
        if (bestVoice) break;
      }
      
      // Fallback to first English voice
      if (!bestVoice) {
        bestVoice = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
      }
      
      setSelectedVoice(bestVoice);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (autoPlay && text && selectedVoice) {
      speak();
    }
  }, [autoPlay, text, selectedVoice]);

  const speak = () => {
    if (!text || isPlaying) return;

    // Stop any existing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice for excited, enthusiastic delivery
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setProgress(0);
      onStart?.();
      startProgressTracking();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      onEnd?.();
      stopProgressTracking();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
      stopProgressTracking();
    };

    utterance.onboundary = (event) => {
      // Update progress based on character position
      const progressPercent = (event.charIndex / text.length) * 100;
      setProgress(progressPercent);
      onProgress?.(progressPercent);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (isPlaying && !isPaused) {
      speechSynthesis.pause();
      setIsPaused(true);
      stopProgressTracking();
    }
  };

  const resume = () => {
    if (isPlaying && isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      startProgressTracking();
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    stopProgressTracking();
  };

  const startProgressTracking = () => {
    progressIntervalRef.current = setInterval(() => {
      // Fallback progress tracking if onboundary doesn't fire
      if (isPlaying && !isPaused) {
        setProgress(prev => Math.min(prev + 1, 95)); // Don't reach 100% until onend
      }
    }, 100);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
      stopProgressTracking();
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const estimatedDuration = text ? Math.ceil(text.length / (rate * 10)) : 0; // Rough estimate
  const currentTime = (progress / 100) * estimatedDuration;

  return (
    <div className="voiceover-container">
      <div className="voiceover-controls">
        <div className="control-buttons">
          {!isPlaying ? (
            <button 
              onClick={speak} 
              className="play-btn"
              disabled={!text || !selectedVoice}
              title="Play voiceover"
            >
              ▶️ Play
            </button>
          ) : (
            <>
              {!isPaused ? (
                <button onClick={pause} className="pause-btn" title="Pause">
                  ⏸️ Pause
                </button>
              ) : (
                <button onClick={resume} className="resume-btn" title="Resume">
                  ▶️ Resume
                </button>
              )}
              <button onClick={stop} className="stop-btn" title="Stop">
                ⏹️ Stop
              </button>
            </>
          )}
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="time-display">
            {formatTime(currentTime)} / {formatTime(estimatedDuration)}
          </div>
        </div>

        <div className="voice-selector">
          <select 
            value={selectedVoice?.name || ''}
            onChange={(e) => {
              const voice = voices.find(v => v.name === e.target.value);
              setSelectedVoice(voice || null);
            }}
            disabled={isPlaying}
          >
            <option value="">Select Voice</option>
            {voices
              .filter(voice => voice.lang.startsWith('en'))
              .map(voice => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))
            }
          </select>
        </div>

        <div className="audio-settings">
          <label>
            Speed: {rate.toFixed(1)}x
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => {
                // Note: Changes will apply to next playback
                console.log('Rate will change to:', e.target.value);
              }}
              disabled={isPlaying}
            />
          </label>
          <label>
            Pitch: {pitch.toFixed(1)}
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => {
                console.log('Pitch will change to:', e.target.value);
              }}
              disabled={isPlaying}
            />
          </label>
          <label>
            Volume: {Math.round(volume * 100)}%
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value);
                if (utteranceRef.current) {
                  utteranceRef.current.volume = newVolume;
                }
              }}
            />
          </label>
        </div>
      </div>

      <div className="text-preview">
        <h4>Voiceover Text:</h4>
        <p className="text-content">{text}</p>
        <div className="text-stats">
          Characters: {text.length} | 
          Estimated Duration: {formatTime(estimatedDuration)} |
          Status: {isPlaying ? (isPaused ? 'Paused' : 'Playing') : 'Stopped'}
        </div>
      </div>

      <style jsx>{`
        .voiceover-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          padding: 20px;
          margin: 16px 0;
          color: white;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }

        .voiceover-controls {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .control-buttons {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .control-buttons button {
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 8px;
          padding: 12px 20px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .control-buttons button:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }

        .control-buttons button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: rgba(255,255,255,0.2);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
          transition: width 0.3s ease;
          border-radius: 4px;
        }

        .time-display {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          min-width: 80px;
        }

        .voice-selector select {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 6px;
          padding: 8px 12px;
          color: white;
          min-width: 200px;
        }

        .voice-selector select option {
          background: #333;
          color: white;
        }

        .audio-settings {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .audio-settings label {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 14px;
        }

        .audio-settings input[type="range"] {
          accent-color: #4facfe;
        }

        .text-preview {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.2);
        }

        .text-preview h4 {
          margin: 0 0 12px 0;
          color: #4facfe;
        }

        .text-content {
          background: rgba(0,0,0,0.2);
          padding: 16px;
          border-radius: 8px;
          line-height: 1.6;
          max-height: 150px;
          overflow-y: auto;
          margin: 0 0 12px 0;
        }

        .text-stats {
          font-size: 12px;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .control-buttons {
            flex-wrap: wrap;
          }
          
          .progress-container {
            flex-direction: column;
            align-items: stretch;
          }
          
          .audio-settings {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Voiceover;

// Utility function to create voiceover text for different sections
export const createVoiceoverScript = {
  intro: () => "Welcome to the most exciting REST API you've ever seen! Get ready to dive into clean, powerful architecture that will revolutionize your development workflow!",
  
  features: (features: string[]) => 
    `Check out these incredible features: ${features.join(', ')}. Each one designed to make your API development faster, cleaner, and more enjoyable!`,
  
  demo: () => "Now let's see this API in action! Watch as we demonstrate lightning-fast responses and bulletproof error handling!",
  
  conclusion: () => "That's the power of modern REST API design! Clean, scalable, and developer-friendly. Ready to build something amazing?"
};