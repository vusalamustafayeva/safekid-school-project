import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface LiveMapProps {
  latitude: number;
  longitude: number;
}

export default function LiveMap({ latitude, longitude }: LiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [latitude, longitude],
        zoom: 16,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      const redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      markerRef.current = L.marker([latitude, longitude], { icon: redIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('Live Standort');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const newLatLng = L.latLng(latitude, longitude);
      markerRef.current.setLatLng(newLatLng);
      mapInstanceRef.current.panTo(newLatLng, { animate: true, duration: 0.5 });
    }
  }, [latitude, longitude]);

  return <div ref={mapRef} className="w-full h-64 rounded-lg" />;
}
