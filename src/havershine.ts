// Converts numeric degrees to radians
const toRadians = (value: number) => value * Math.PI / 180;

// This formula does not take an account that Earth is ellipsoid
// http://rosettacode.org/wiki/Haversine_formula
export const haversine = (lat1: number, lat2: number, lng1: number, lng2: number) => {
    const radius = 6372.8; // Average radius of Earth
    const deltaLat = toRadians(lat2 - lat1);
    const deltaLng = toRadians(lng2 - lng1);
    lat1 = toRadians(lat1);
    lat2 = toRadians(lat2);
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return radius * c;
}
