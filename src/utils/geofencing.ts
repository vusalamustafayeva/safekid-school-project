export interface Location {
  latitude: number;
  longitude: number;
}

export interface School {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  geofence_radius_meters: number;
}

export function calculateDistance(point1: Location, point2: Location): number {
  const R = 6371e3;
  const φ1 = (point1.latitude * Math.PI) / 180;
  const φ2 = (point2.latitude * Math.PI) / 180;
  const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function isWithinGeofence(
  childLocation: Location,
  school: School
): boolean {
  const distance = calculateDistance(childLocation, {
    latitude: school.latitude,
    longitude: school.longitude,
  });
  return distance <= school.geofence_radius_meters;
}

export function getSchoolsWithinRange(
  childLocation: Location,
  schools: School[]
): School[] {
  return schools.filter(school => isWithinGeofence(childLocation, school));
}
