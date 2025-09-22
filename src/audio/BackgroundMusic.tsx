import React, { useState, useRef, useEffect } from 'react';

interface BackgroundMusicProps {
  tracks?: MusicTrack[];
  autoPlay?: boolean;
  volume?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  onTrackChange?: (track: MusicTrack) => void;
  className?: string;
}

interface MusicTrack {
  id: string;
  name: string;
  url?: string;
  frequency?: number; // For generated tones
  type: 'url' | 'generated' | 'webaudio';
  duration?: number;
  bpm?: number;
  genre?: string;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  tracks = [],
  autoPlay = false,
  volume = 0.3, // Lower volume for background
  fadeInDuration = 2000,
  fadeOutDuration = 1000,
  onTrackChange,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [isLoading, setIsLoading] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Default tech/electronic tracks (generated using Web Audio API)
  const defaultTracks: MusicTrack[] = [
    {
      id: 'tech-ambient-1',
      name: 'Tech Ambient Flow',
      type: 'generated',
      frequency: 220,
      duration: 120,
      bpm: 120,
      genre: 'ambient-tech'
    },
    {
      id: 'electronic-pulse',
      name: 'Electronic Pulse',
      type: 'generated',
      frequency: 330,
      duration: 150,
      bpm: 128,
      genre: 'electronic'
    },
    {
      id: 'digital-waves',
      name: 'Digital Waves',
      type: 'generated',
      frequency: 440,
      duration: 180,
      bpm: 110,
      genre: 'synthwave'
    },
    {
      id: 'code-rhythm',
      name: 'Code Rhythm',
      type: 'generated',
      frequency: 294,
      duration: 200,
      bpm: 140,
      genre: 'tech-house'
    }
  ];

  const allTracks = tracks.length > 0 ? tracks : defaultTracks;

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = async () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const gain = context.createGain();
        gain.connect(context.destination);
        gain.gain.setValueAtTime(0, context.currentTime);

        setAudioContext(context);
        setGainNode(gain);
      } catch (error) {
        console.error('Failed to initialize Web Audio API:', error);
      }
    };

    initAudio();

    return () => {
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (autoPlay && allTracks.length > 0 && audioContext) {
      playTrack(allTracks[0]);
    }
  }, [autoPlay, audioContext]);

  const createTechMusic = (track: MusicTrack): void => {
    if (!audioContext || !gainNode) return;

    // Stop any existing audio
    stopCurrentAudio();

    try {
      // Create a complex electronic sound
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const oscillator3 = audioContext.createOscillator();

      const filter1 = audioContext.createBiquadFilter();
      const filter2 = audioContext.createBiquadFilter();
      const delay = audioContext.createDelay(1.0);
      const feedback = audioContext.createGain();

      // Configure oscillators for rich electronic sound
      oscillator1.type = 'sawtooth';
      oscillator1.frequency.setValueAtTime(track.frequency || 220, audioContext.currentTime);

      oscillator2.type = 'square';
      oscillator2.frequency.setValueAtTime((track.frequency || 220) * 1.5, audioContext.currentTime);

      oscillator3.type = 'sine';
      oscillator3.frequency.setValueAtTime((track.frequency || 220) * 0.5, audioContext.currentTime);

      // Configure filters
      filter1.type = 'lowpass';
      filter1.frequency.setValueAtTime(1000, audioContext.currentTime);
      filter1.Q.setValueAtTime(10, audioContext.currentTime);

      filter2.type = 'highpass';
      filter2.frequency.setValueAtTime(100, audioContext.currentTime);

      // Configure delay/reverb
      delay.delayTime.setValueAtTime(0.3, audioContext.currentTime);
      feedback.gain.setValueAtTime(0.3, audioContext.currentTime);

      // Create gain nodes for mixing
      const osc1Gain = audioContext.createGain();
      const osc2Gain = audioContext.createGain();
      const osc3Gain = audioContext.createGain();

      osc1Gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      osc2Gain.gain.setValueAtTime(0.2, audioContext.currentTime);
      osc3Gain.gain.setValueAtTime(0.4, audioContext.currentTime);

      // Connect the audio graph
      oscillator1.connect(osc1Gain);
      oscillator2.connect(osc2Gain);
      oscillator3.connect(osc3Gain);

      osc1Gain.connect(filter1);
      osc2Gain.connect(filter1);
      osc3Gain.connect(filter2);

      filter1.connect(delay);
      filter2.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(gainNode);

      // Add some modulation for movement
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.5, audioContext.currentTime);
      lfoGain.gain.setValueAtTime(50, audioContext.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter1.frequency);

      // Start all oscillators
      oscillator1.start(audioContext.currentTime);
      oscillator2.start(audioContext.currentTime);
      oscillator3.start(audioContext.currentTime);
      lfo.start(audioContext.currentTime);

      // Store reference for cleanup
      oscillatorRef.current = oscillator1; // Store one for reference

      // Auto-stop after duration
      if (track.duration) {
        setTimeout(() => {
          if (oscillatorRef.current === oscillator1) {
            stopCurrentAudio();
            // Auto-play next track
            const currentIndex = allTracks.findIndex(t => t.id === track.id);
            const nextTrack = allTracks[(currentIndex + 1) % allTracks.length];
            if (isPlaying) {
              playTrack(nextTrack);
            }
          }
        }, track.duration * 1000);
      }

    } catch (error) {
      console.error('Error creating tech music:', error);
    }
  };

  const playTrack = async (track: MusicTrack) => {
    if (!audioContext || !gainNode) return;

    setIsLoading(true);
    setCurrentTrack(track);

    try {
      if (track.type === 'url' && track.url) {
        // Handle URL-based audio
        if (audioRef.current) {
          audioRef.current.pause();
        }

        const audio = new Audio(track.url);
        audio.volume = 0;
        audio.loop = true;

        await new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', resolve);
          audio.addEventListener('error', reject);
          audio.load();
        });

        audioRef.current = audio;
        audio.play();

        // Fade in
        fadeIn(audio);

      } else if (track.type === 'generated') {
        // Handle generated electronic music
        createTechMusic(track);

        // Fade in the gain node
        if (gainNode) {\n          fadeInGainNode();\n        }\n      }\n      \n      setIsPlaying(true);\n      onTrackChange?.(track);\n      \n    } catch (error) {\n      console.error('Error playing track:', error);\n    } finally {\n      setIsLoading(false);\n    }\n  };\n\n  const stopCurrentAudio = () => {\n    // Stop HTML audio\n    if (audioRef.current) {\n      audioRef.current.pause();\n      audioRef.current = null;\n    }\n    \n    // Stop Web Audio oscillators\n    if (oscillatorRef.current) {\n      try {\n        oscillatorRef.current.stop();\n      } catch (e) {\n        // Oscillator may already be stopped\n      }\n      oscillatorRef.current = null;\n    }\n    \n    // Clear fade timeout\n    if (fadeTimeoutRef.current) {\n      clearTimeout(fadeTimeoutRef.current);\n      fadeTimeoutRef.current = null;\n    }\n  };\n\n  const fadeIn = (audio: HTMLAudioElement) => {\n    const startTime = Date.now();\n    const fadeStep = () => {\n      const elapsed = Date.now() - startTime;\n      const progress = Math.min(elapsed / fadeInDuration, 1);\n      audio.volume = currentVolume * progress;\n      \n      if (progress < 1) {\n        requestAnimationFrame(fadeStep);\n      }\n    };\n    requestAnimationFrame(fadeStep);\n  };\n\n  const fadeInGainNode = () => {\n    if (!gainNode || !audioContext) return;\n    \n    gainNode.gain.cancelScheduledValues(audioContext.currentTime);\n    gainNode.gain.setValueAtTime(0, audioContext.currentTime);\n    gainNode.gain.linearRampToValueAtTime(\n      currentVolume, \n      audioContext.currentTime + (fadeInDuration / 1000)\n    );\n  };\n\n  const fadeOut = (callback?: () => void) => {\n    if (audioRef.current) {\n      const audio = audioRef.current;\n      const startVolume = audio.volume;\n      const startTime = Date.now();\n      \n      const fadeStep = () => {\n        const elapsed = Date.now() - startTime;\n        const progress = Math.min(elapsed / fadeOutDuration, 1);\n        audio.volume = startVolume * (1 - progress);\n        \n        if (progress < 1) {\n          requestAnimationFrame(fadeStep);\n        } else {\n          callback?.();\n        }\n      };\n      requestAnimationFrame(fadeStep);\n    } else if (gainNode && audioContext) {\n      gainNode.gain.cancelScheduledValues(audioContext.currentTime);\n      gainNode.gain.linearRampToValueAtTime(\n        0, \n        audioContext.currentTime + (fadeOutDuration / 1000)\n      );\n      \n      fadeTimeoutRef.current = setTimeout(() => {\n        callback?.();\n      }, fadeOutDuration);\n    } else {\n      callback?.();\n    }\n  };\n\n  const play = () => {\n    if (!currentTrack && allTracks.length > 0) {\n      playTrack(allTracks[0]);\n    } else if (currentTrack) {\n      playTrack(currentTrack);\n    }\n  };\n\n  const pause = () => {\n    setIsPlaying(false);\n    fadeOut(() => {\n      stopCurrentAudio();\n    });\n  };\n\n  const stop = () => {\n    setIsPlaying(false);\n    stopCurrentAudio();\n    setCurrentTrack(null);\n    if (gainNode && audioContext) {\n      gainNode.gain.setValueAtTime(0, audioContext.currentTime);\n    }\n  };\n\n  const changeVolume = (newVolume: number) => {\n    setCurrentVolume(newVolume);\n    \n    if (audioRef.current) {\n      audioRef.current.volume = newVolume;\n    }\n    \n    if (gainNode && audioContext && isPlaying) {\n      gainNode.gain.setValueAtTime(newVolume, audioContext.currentTime);\n    }\n  };\n\n  const nextTrack = () => {\n    if (!currentTrack) return;\n    \n    const currentIndex = allTracks.findIndex(t => t.id === currentTrack.id);\n    const nextIndex = (currentIndex + 1) % allTracks.length;\n    \n    fadeOut(() => {\n      playTrack(allTracks[nextIndex]);\n    });\n  };\n\n  const previousTrack = () => {\n    if (!currentTrack) return;\n    \n    const currentIndex = allTracks.findIndex(t => t.id === currentTrack.id);\n    const prevIndex = currentIndex === 0 ? allTracks.length - 1 : currentIndex - 1;\n    \n    fadeOut(() => {\n      playTrack(allTracks[prevIndex]);\n    });\n  };\n\n  return (\n    <div className={`background-music ${className}`}>\n      <div className=\"music-controls\">\n        <div className=\"playback-controls\">\n          <button \n            onClick={previousTrack} \n            disabled={!currentTrack || allTracks.length <= 1}\n            title=\"Previous track\"\n          >\n            ⏮️\n          </button>\n          \n          {!isPlaying ? (\n            <button \n              onClick={play} \n              disabled={isLoading || !audioContext}\n              className=\"play-pause-btn\"\n              title=\"Play music\"\n            >\n              {isLoading ? '⏳' : '▶️'}\n            </button>\n          ) : (\n            <button \n              onClick={pause} \n              className=\"play-pause-btn\"\n              title=\"Pause music\"\n            >\n              ⏸️\n            </button>\n          )}\n          \n          <button \n            onClick={stop}\n            disabled={!isPlaying && !currentTrack}\n            title=\"Stop music\"\n          >\n            ⏹️\n          </button>\n          \n          <button \n            onClick={nextTrack}\n            disabled={!currentTrack || allTracks.length <= 1}\n            title=\"Next track\"\n          >\n            ⏭️\n          </button>\n        </div>\n\n        <div className=\"volume-control\">\n          <span className=\"volume-icon\">🔊</span>\n          <input\n            type=\"range\"\n            min=\"0\"\n            max=\"1\"\n            step=\"0.05\"\n            value={currentVolume}\n            onChange={(e) => changeVolume(parseFloat(e.target.value))}\n            className=\"volume-slider\"\n            title={`Volume: ${Math.round(currentVolume * 100)}%`}\n          />\n          <span className=\"volume-percentage\">\n            {Math.round(currentVolume * 100)}%\n          </span>\n        </div>\n      </div>\n\n      <div className=\"track-info\">\n        {currentTrack ? (\n          <div className=\"current-track\">\n            <div className=\"track-name\">🎵 {currentTrack.name}</div>\n            <div className=\"track-details\">\n              {currentTrack.genre && <span className=\"genre\">{currentTrack.genre}</span>}\n              {currentTrack.bpm && <span className=\"bpm\">{currentTrack.bpm} BPM</span>}\n              <span className=\"status\">\n                {isPlaying ? '🔊 Playing' : '⏸️ Paused'}\n              </span>\n            </div>\n          </div>\n        ) : (\n          <div className=\"no-track\">🎵 Select a track to play</div>\n        )}\n      </div>\n\n      <div className=\"track-list\">\n        <h4>Available Tracks:</h4>\n        <div className=\"tracks\">\n          {allTracks.map((track) => (\n            <button\n              key={track.id}\n              onClick={() => {\n                if (isPlaying && currentTrack?.id === track.id) {\n                  pause();\n                } else {\n                  playTrack(track);\n                }\n              }}\n              className={`track-button ${\n                currentTrack?.id === track.id ? 'active' : ''\n              }`}\n              disabled={isLoading}\n            >\n              <div className=\"track-title\">{track.name}</div>\n              <div className=\"track-info-small\">\n                {track.genre} • {track.bpm} BPM\n                {track.duration && ` • ${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`}\n              </div>\n            </button>\n          ))}\n        </div>\n      </div>\n\n      <style jsx>{`\n        .background-music {\n          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);\n          border-radius: 12px;\n          padding: 20px;\n          margin: 16px 0;\n          color: white;\n          box-shadow: 0 8px 32px rgba(0,0,0,0.1);\n        }\n\n        .music-controls {\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n          margin-bottom: 20px;\n          flex-wrap: wrap;\n          gap: 16px;\n        }\n\n        .playback-controls {\n          display: flex;\n          gap: 8px;\n          align-items: center;\n        }\n\n        .playback-controls button {\n          background: rgba(255,255,255,0.2);\n          border: none;\n          border-radius: 50%;\n          width: 44px;\n          height: 44px;\n          color: white;\n          font-size: 16px;\n          cursor: pointer;\n          transition: all 0.3s ease;\n          backdrop-filter: blur(10px);\n          display: flex;\n          align-items: center;\n          justify-content: center;\n        }\n\n        .playback-controls button:hover:not(:disabled) {\n          background: rgba(255,255,255,0.3);\n          transform: scale(1.1);\n        }\n\n        .playback-controls button:disabled {\n          opacity: 0.5;\n          cursor: not-allowed;\n          transform: none;\n        }\n\n        .play-pause-btn {\n          width: 52px !important;\n          height: 52px !important;\n          font-size: 20px !important;\n        }\n\n        .volume-control {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          min-width: 180px;\n        }\n\n        .volume-icon {\n          font-size: 18px;\n        }\n\n        .volume-slider {\n          flex: 1;\n          accent-color: #4facfe;\n          height: 6px;\n        }\n\n        .volume-percentage {\n          font-size: 12px;\n          min-width: 35px;\n          text-align: right;\n          font-family: 'Courier New', monospace;\n        }\n\n        .track-info {\n          background: rgba(0,0,0,0.2);\n          border-radius: 8px;\n          padding: 16px;\n          margin-bottom: 20px;\n        }\n\n        .current-track .track-name {\n          font-size: 18px;\n          font-weight: 600;\n          margin-bottom: 8px;\n          color: #4facfe;\n        }\n\n        .track-details {\n          display: flex;\n          gap: 12px;\n          align-items: center;\n          flex-wrap: wrap;\n          font-size: 14px;\n          opacity: 0.9;\n        }\n\n        .track-details span {\n          background: rgba(255,255,255,0.1);\n          padding: 4px 8px;\n          border-radius: 4px;\n          font-size: 12px;\n        }\n\n        .no-track {\n          text-align: center;\n          opacity: 0.7;\n          font-style: italic;\n        }\n\n        .track-list h4 {\n          margin: 0 0 12px 0;\n          color: #4facfe;\n          font-size: 16px;\n        }\n\n        .tracks {\n          display: grid;\n          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n          gap: 8px;\n        }\n\n        .track-button {\n          background: rgba(255,255,255,0.1);\n          border: 1px solid rgba(255,255,255,0.2);\n          border-radius: 8px;\n          padding: 12px;\n          color: white;\n          cursor: pointer;\n          transition: all 0.3s ease;\n          text-align: left;\n        }\n\n        .track-button:hover:not(:disabled) {\n          background: rgba(255,255,255,0.2);\n          transform: translateY(-2px);\n        }\n\n        .track-button.active {\n          background: rgba(79, 172, 254, 0.3);\n          border-color: #4facfe;\n        }\n\n        .track-button:disabled {\n          opacity: 0.5;\n          cursor: not-allowed;\n          transform: none;\n        }\n\n        .track-title {\n          font-weight: 600;\n          margin-bottom: 4px;\n        }\n\n        .track-info-small {\n          font-size: 12px;\n          opacity: 0.8;\n        }\n\n        @media (max-width: 768px) {\n          .music-controls {\n            flex-direction: column;\n            align-items: stretch;\n          }\n          \n          .volume-control {\n            justify-content: center;\n            min-width: auto;\n          }\n          \n          .tracks {\n            grid-template-columns: 1fr;\n          }\n        }\n      `}</style>\n    </div>\n  );\n};\n\nexport default BackgroundMusic;\n\n// Utility function to create music tracks for different moods\nexport const createMusicLibrary = {\n  techDemo: (): MusicTrack[] => [\n    {\n      id: 'tech-showcase',\n      name: 'Tech Showcase',\n      type: 'generated',\n      frequency: 220,\n      duration: 180,\n      bpm: 125,\n      genre: 'tech-house'\n    },\n    {\n      id: 'digital-innovation',\n      name: 'Digital Innovation',\n      type: 'generated',\n      frequency: 330,\n      duration: 160,\n      bpm: 128,\n      genre: 'electronic'\n    }\n  ],\n  \n  ambient: (): MusicTrack[] => [\n    {\n      id: 'code-flow',\n      name: 'Code Flow',\n      type: 'generated',\n      frequency: 196,\n      duration: 300,\n      bpm: 90,\n      genre: 'ambient'\n    },\n    {\n      id: 'data-streams',\n      name: 'Data Streams',\n      type: 'generated',\n      frequency: 147,\n      duration: 240,\n      bpm: 85,\n      genre: 'ambient-tech'\n    }\n  ],\n  \n  upbeat: (): MusicTrack[] => [\n    {\n      id: 'api-power',\n      name: 'API Power',\n      type: 'generated',\n      frequency: 440,\n      duration: 120,\n      bpm: 140,\n      genre: 'tech-trance'\n    },\n    {\n      id: 'system-pulse',\n      name: 'System Pulse',\n      type: 'generated',\n      frequency: 370,\n      duration: 140,\n      bpm: 135,\n      genre: 'electronic-dance'\n    }\n  ]\n};