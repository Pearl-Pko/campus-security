const getPlaceIdFromCoordinates  = async (latitude: string, longitude: string, key: string) : Promise<string | void> => {
    const API_KEY = 'YOUR_API_KEY';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].place_id;
      }
      throw new Error('Place ID not found');
    } catch (error) {
      console.error('Error fetching place ID:', error);
    }
  };

export const getPlaceDetails = async (placeId: string, key: string) => {
  const API_KEY = 'YOUR_API_KEY';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.result) {
      return data.result; // This is the GooglePlaceDetail object
    }
    throw new Error('Place details not found');
  } catch (error) {
    console.error('Error fetching place details:', error);
  }
}

const fetchGooglePlaceDetail = async (latitude: string, longitude: string) => {
    try {
      const placeId = await getPlaceIdFromCoordinates(lat, lng);
      const placeDetails = await getPlaceDetails(placeId);
      console.log('Place Details:', placeDetails);
      return placeDetails;
    } catch (error) {
      console.error('Error fetching Google Place Details:', error);
    }
  };
  