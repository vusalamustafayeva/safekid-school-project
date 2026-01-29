import { AlertCircle, Bell } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Demo child ID for school project demonstrations
// This allows the app to work without authentication
const DEMO_CHILD_ID = 'demo-child';

export default function ChildApp() {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [isPressed, setIsPressed] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [isPlayingSignal, setIsPlayingSignal] = useState(false);
  const holdTimerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const modulationIntervalRef = useRef<number | null>(null);

  const handlePressStart = () => {
    if (status !== 'idle') return;

    setIsPressed(true);
    setHoldProgress(0);

    progressIntervalRef.current = window.setInterval(() => {
      setHoldProgress((prev) => {
        const next = prev + (100 / 30);
        if (next >= 100) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          return 100;
        }
        return next;
      });
    }, 100);

    holdTimerRef.current = window.setTimeout(() => {
      handleSOS();
    }, 3000);
  };

  const handlePressEnd = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setIsPressed(false);
    setHoldProgress(0);
  };

  const handleSOS = async () => {
    setStatus('sending');

    console.log('🚨 DEMO MODE: Sending SOS event as demo-child');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };

          console.log('📍 Location obtained:', location);

          const { data, error } = await supabase.from('sos_events').insert({
            child_id: DEMO_CHILD_ID,
            latitude: location.latitude,
            longitude: location.longitude,
            location_accuracy: location.accuracy,
            status: 'active',
          }).select();

          if (error) {
            console.error('❌ Database error:', error);
            throw error;
          }

          console.log('✅ SOS EVENT CREATED:', data);
          console.log('🔔 NOTIFICATION LOGIC:');
          console.log('  📱 Parent App: WILL receive notification (always notified)');
          console.log(`  🏫 School App: Checking geofence for location (${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)})...`);
          console.log('  📏 School will be notified ONLY if child is within 1 km of BBS Cora Berliner (Hannover)');
          console.log('  🗺️ BBS Cora Berliner location: 52.38875°N, 9.81001°E');
          setStatus('sent');
          setTimeout(() => {
            setStatus('idle');
            setIsPressed(false);
          }, 2000);
        } catch (error) {
          console.error('❌ Failed to send SOS:', error);
          alert('Fehler beim Senden des Notrufs. Bitte versuche es erneut.');
          setStatus('idle');
          setIsPressed(false);
        }
      },
      (error) => {
        console.error('❌ Location access denied:', error);
        alert('Standortzugriff verweigert. Bitte erlaube den Standortzugriff in deinen Browser-Einstellungen.');
        setStatus('idle');
        setIsPressed(false);
      }
    );
  };

  const handleSignalSound = () => {
    if (isPlayingSignal) {
      // Stop the signal
      if (modulationIntervalRef.current) {
        clearInterval(modulationIntervalRef.current);
        modulationIntervalRef.current = null;
      }
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {
          // Already stopped
        }
        oscillatorRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsPlayingSignal(false);
    } else {
      // Start the signal
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillatorRef.current = oscillator;
        gainNodeRef.current = gainNode;

        setIsPlayingSignal(true);

        // Modulate frequency for alarm effect
        modulationIntervalRef.current = window.setInterval(() => {
          if (oscillatorRef.current && audioContextRef.current) {
            const currentFreq = oscillatorRef.current.frequency.value;
            oscillatorRef.current.frequency.setValueAtTime(
              currentFreq === 800 ? 1000 : 800,
              audioContextRef.current.currentTime
            );
          }
        }, 300);
      } catch (error) {
        console.error('Error playing signal sound:', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

      // Cleanup audio
      if (modulationIntervalRef.current) clearInterval(modulationIntervalRef.current);
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {
          // Ignore if already stopped
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <img
              src="/44873c82-639d-4d3f-afb3-4e8ce30b2445.png"
              alt="SafeKid Logo"
              className="w-24 h-24 mx-auto mb-4 object-contain"
            />
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              SafeKid
            </h1>
            <p className="text-gray-600">{t('childApp.title')}</p>
          </div>

          <div className="relative">
            <button
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
              disabled={status !== 'idle'}
              className={`w-full aspect-square rounded-full flex flex-col items-center justify-center text-white font-bold text-4xl transition-all transform relative ${
                isPressed ? 'scale-95' : 'scale-100'
              } ${
                status === 'idle'
                  ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-xl hover:shadow-2xl'
                  : status === 'sending'
                  ? 'bg-gradient-to-br from-yellow-500 to-orange-500 animate-pulse'
                  : 'bg-gradient-to-br from-green-500 to-green-600'
              }`}
            >
              {isPressed && status === 'idle' && (
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeDasharray={`${2 * Math.PI * 48}`}
                    strokeDashoffset={`${2 * Math.PI * 48 * (1 - holdProgress / 100)}`}
                    className="transition-all duration-100"
                    opacity="0.8"
                  />
                </svg>
              )}
              <AlertCircle className="w-24 h-24 mb-4 relative z-10" />
              <span className="text-2xl relative z-10">
                {status === 'idle' && (isPressed ? Math.ceil(3 - (holdProgress / 100) * 3) : t('childApp.button'))}
                {status === 'sending' && t('childApp.sending')}
                {status === 'sent' && t('childApp.sent')}
              </span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 leading-relaxed">
              {status === 'idle' ?
                'Halte den Knopf 3 Sekunden gedrückt, um Hilfe zu rufen.' :
                'Drücke den Knopf nur in echten Notfällen oder wenn du Hilfe brauchst.'
              }
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSignalSound}
              disabled={status !== 'idle'}
              className={`w-full py-3 px-4 ${
                isPlayingSignal
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                  : 'bg-gradient-to-r from-blue-500 to-slate-700 hover:from-blue-600 hover:to-slate-800'
              } disabled:from-gray-300 disabled:to-gray-400 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2`}
            >
              <Bell className={`w-5 h-5 ${isPlayingSignal ? 'animate-pulse' : ''}`} />
              {isPlayingSignal ? 'Signalton stoppen' : 'Signalton auslösen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
