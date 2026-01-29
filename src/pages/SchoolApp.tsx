import { Phone, MapPin, AlertCircle, Check, Clock } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import LiveMap from '../components/LiveMap';

const SCHOOL_NAME = 'BBS Cora Berliner';

interface SOSEvent {
  id: string;
  child_id: string;
  latitude: number;
  longitude: number;
  location_accuracy: number | null;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledged_at: string | null;
  resolved_at: string | null;
  created_at: string;
}

interface School {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  geofence_radius_meters: number;
}

interface Address {
  street?: string;
  house_number?: string;
  postcode?: string;
  city?: string;
  town?: string;
  village?: string;
  loading: boolean;
  error: boolean;
}

// Haversine formula to calculate distance between two coordinates in meters
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export default function SchoolApp() {
  const { t } = useLanguage();
  const [school, setSchool] = useState<School | null>(null);
  const [events, setEvents] = useState<SOSEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Record<string, Address>>({});
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [locallyAcknowledged, setLocallyAcknowledged] = useState<Set<string>>(new Set());

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const modulationIntervalRef = useRef<number | null>(null);

  const playAlarm = () => {
    if (isAlarmPlaying) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;

      setIsAlarmPlaying(true);

      modulationIntervalRef.current = window.setInterval(() => {
        if (oscillatorRef.current && audioContextRef.current) {
          const currentFreq = oscillatorRef.current.frequency.value;
          oscillatorRef.current.frequency.setValueAtTime(
            currentFreq === 800 ? 1200 : 800,
            audioContextRef.current.currentTime
          );
        }
      }, 400);

      console.log('🚨 School alarm started');
    } catch (error) {
      console.error('Error playing alarm:', error);
    }
  };

  const stopAlarm = () => {
    if (!isAlarmPlaying) return;

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
    setIsAlarmPlaying(false);
    console.log('🔇 School alarm stopped');
  };

  // Load school data on mount
  useEffect(() => {
    console.log(`🏫 School App: Loading ${SCHOOL_NAME} and monitoring geofenced SOS events`);
    loadSchoolData();
  }, []);

  // Set up realtime subscription when school is loaded
  useEffect(() => {
    if (!school) {
      console.log('⏳ Waiting for school data before setting up subscription...');
      return;
    }

    console.log(`✅ School loaded: ${school.name}, setting up realtime subscription...`);

    // Initial data load
    loadData();

    // Set up realtime subscription
    const sosSubscription = supabase
      .channel('school_sos_events_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sos_events',
        },
        (payload) => {
          console.log('🔔 Real-time SOS event received in school app:', payload);
          console.log('🔄 Reloading and filtering events by geofence...');
          loadData();
        }
      )
      .subscribe((status) => {
        console.log('📡 School SOS subscription status:', status);
      });

    return () => {
      console.log('🔌 Unsubscribing from school SOS events');
      sosSubscription.unsubscribe();
    };
  }, [school]);

  useEffect(() => {
    const hasUnacknowledgedActiveEvent = events.some(
      (event) => event.status === 'active' && !locallyAcknowledged.has(event.id)
    );

    if (hasUnacknowledgedActiveEvent && !isAlarmPlaying) {
      playAlarm();
    } else if (!hasUnacknowledgedActiveEvent && isAlarmPlaying) {
      stopAlarm();
    }
  }, [events, isAlarmPlaying, locallyAcknowledged]);

  useEffect(() => {
    return () => {
      stopAlarm();
    };
  }, []);

  const loadSchoolData = async () => {
    console.log(`🏫 Loading school data for: ${SCHOOL_NAME}`);

    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('name', SCHOOL_NAME)
      .maybeSingle();

    if (error) {
      console.error('❌ Error loading school data:', error);
    } else if (data) {
      console.log('✅ Loaded school data:', data);
      setSchool(data);
    } else {
      console.warn(`⚠️ School not found: ${SCHOOL_NAME}`);
    }
  };

  const reverseGeocode = async (eventId: string, latitude: number, longitude: number) => {
    setAddresses((prev) => ({
      ...prev,
      [eventId]: { loading: true, error: false },
    }));

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'SafeKid Demo App',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();
      console.log('🗺️ Reverse geocoding result:', data);

      setAddresses((prev) => ({
        ...prev,
        [eventId]: {
          street: data.address?.road,
          house_number: data.address?.house_number,
          postcode: data.address?.postcode,
          city: data.address?.city || data.address?.town || data.address?.village,
          loading: false,
          error: false,
        },
      }));
    } catch (error) {
      console.error('❌ Reverse geocoding failed:', error);
      setAddresses((prev) => ({
        ...prev,
        [eventId]: { loading: false, error: true },
      }));
    }
  };

  const loadData = useCallback(async () => {
    console.log('📊 Loading ALL SOS events and filtering by school geofence...');

    if (!school) {
      console.log('⚠️ School data not loaded yet, waiting...');
      setLoading(false);
      return;
    }

    // Get ALL active/acknowledged SOS events (not just children associated with the school)
    const { data: allEvents, error } = await supabase
      .from('sos_events')
      .select('*')
      .in('status', ['active', 'acknowledged'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error loading SOS events:', error);
      setLoading(false);
      return;
    }

    console.log(`✅ Loaded ${allEvents?.length || 0} total SOS events`);

    // Filter events based on geofence - only show events within 1 km of school
    if (allEvents) {
      const filteredEvents = allEvents.filter((event) => {
        const distance = calculateDistance(
          school.latitude,
          school.longitude,
          event.latitude,
          event.longitude
        );
        const isWithinGeofence = distance <= school.geofence_radius_meters;
        console.log(`📏 Event ${event.id}: ${distance.toFixed(0)}m from ${school.name} (${isWithinGeofence ? 'WITHIN' : 'OUTSIDE'} ${school.geofence_radius_meters}m geofence)`);

        if (isWithinGeofence) {
          console.log(`🏫 SCHOOL ALERT TRIGGERED: Event ${event.id.substring(0, 8)} is within geofence - School will be notified!`);
        } else {
          console.log(`🔒 SCHOOL ALERT BLOCKED: Event ${event.id.substring(0, 8)} is outside geofence - Privacy protected.`);
        }

        return isWithinGeofence;
      });

      console.log(`✅ Filtered to ${filteredEvents.length} events within ${school.name} geofence`);

      if (filteredEvents.length > 0) {
        console.log(`🚨 SCHOOL NOTIFICATION: ${school.name} has ${filteredEvents.length} active emergency event(s) to display!`);
      } else {
        console.log(`✅ No events within ${school.name} geofence - Waiting for SOS signals...`);
      }

      setEvents(filteredEvents);

      filteredEvents.forEach((event) => {
        reverseGeocode(event.id, event.latitude, event.longitude);
      });
    } else {
      setEvents([]);
    }

    setLoading(false);
  }, [school]);

  const handleAcknowledge = (eventId: string) => {
    console.log('✓ School locally acknowledging SOS event (alarm stopped for school only):', eventId);

    setLocallyAcknowledged((prev) => new Set(prev).add(eventId));
    stopAlarm();
  };

  const handleResolve = async (eventId: string) => {
    console.log('✓ School resolving SOS event:', eventId);

    const { error } = await supabase
      .from('sos_events')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
      })
      .eq('id', eventId);

    if (error) {
      console.error('❌ Error resolving event:', error);
    } else {
      loadData();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAddressDisplay = (eventId: string, latitude: number, longitude: number) => {
    const address = addresses[eventId];

    if (!address || address.loading) {
      return (
        <p className="text-sm text-gray-600 italic">Adresse wird geladen…</p>
      );
    }

    if (address.error || !address.city) {
      return (
        <p className="text-sm text-gray-600 font-mono">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </p>
      );
    }

    const street = address.street && address.house_number
      ? `${address.street} ${address.house_number}`
      : address.street || '';

    const cityLine = address.postcode && address.city
      ? `${address.postcode} ${address.city}`
      : address.city || '';

    return (
      <>
        {street && <p className="text-sm text-gray-900 font-medium">{street}</p>}
        {cityLine && <p className="text-sm text-gray-600">{cityLine}</p>}
      </>
    );
  };

  const getDistanceFromSchool = (latitude: number, longitude: number): string => {
    if (!school) return '';
    const distance = calculateDistance(
      school.latitude,
      school.longitude,
      latitude,
      longitude
    );
    return distance < 1000
      ? `${Math.round(distance)}m von der Schule`
      : `${(distance / 1000).toFixed(1)}km von der Schule`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-200 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <div className="flex flex-col items-center mb-8">
            <img
              src="/44873c82-639d-4d3f-afb3-4e8ce30b2445.png"
              alt="SafeKid Logo"
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-3xl font-bold text-blue-600 mb-2">SafeKid</h1>
            {school && (
              <p className="text-gray-600 text-sm text-center">
                {school.name} • Geofence: {school.geofence_radius_meters}m
              </p>
            )}
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Lade Notfälle...</p>
              </div>
            ) : events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.id}
                  className={`border-2 rounded-xl p-6 ${
                    locallyAcknowledged.has(event.id)
                      ? 'border-yellow-400 bg-yellow-50'
                      : event.status === 'active'
                      ? 'border-red-400 bg-red-50'
                      : 'border-yellow-400 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          locallyAcknowledged.has(event.id)
                            ? 'bg-yellow-500'
                            : event.status === 'active'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}
                      >
                        <AlertCircle className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {locallyAcknowledged.has(event.id)
                            ? 'Bestätigter Notfall (Schule)'
                            : event.status === 'active'
                            ? t('parentApp.activeEvent')
                            : 'Bestätigter Notfall'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(event.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900">
                            Notfall-Position
                          </p>
                          <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                            SOS
                          </span>
                        </div>
                        <div className="mb-2">
                          {getAddressDisplay(event.id, event.latitude, event.longitude)}
                        </div>
                        <p className="text-xs text-blue-600 font-medium">
                          {getDistanceFromSchool(event.latitude, event.longitude)}
                        </p>
                        {event.location_accuracy && (
                          <p className="text-xs text-gray-500 mt-1">
                            Genauigkeit: ±{event.location_accuracy}m
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 rounded-lg overflow-hidden border-2 border-red-200">
                      <LiveMap
                        latitude={event.latitude}
                        longitude={event.longitude}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => alert('In einer echten App würde hier die Telefon-App geöffnet')}
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span>{t('parentApp.call')}</span>
                    </button>
                    {locallyAcknowledged.has(event.id) || event.status === 'acknowledged' ? (
                      <button
                        onClick={() => handleResolve(event.id)}
                        className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                      >
                        <Check className="w-5 h-5" />
                        <span>{t('parentApp.resolve')}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAcknowledge(event.id)}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                      >
                        <Check className="w-5 h-5" />
                        <span>{t('parentApp.acknowledge')}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="border-2 border-blue-200 rounded-xl p-8 bg-blue-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Warte auf Notfall-Signal
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {school
                      ? `Überwache Notfälle im Umkreis von ${school.geofence_radius_meters}m um ${school.name}.`
                      : 'Lade Schulinformationen...'}
                  </p>
                  <p className="text-sm text-gray-600 mb-6">
                    Sobald ein Kind im Geofence-Bereich ein SOS-Signal sendet, erscheint es hier mit der Live-Position.
                  </p>
                  <div className="rounded-lg overflow-hidden border-2 border-blue-200 h-64 flex items-center justify-center bg-white">
                    <div className="text-gray-400 text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Karte wird beim SOS-Notruf angezeigt</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
