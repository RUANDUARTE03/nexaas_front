import axios from 'axios';

const GEOCODE_API =
  'https://maps.googleapis.com/maps/api/geocode';

export function getLatLngByZipCode(zipCode) {
  return axios.get(
    `${GEOCODE_API}/json?address=${zipCode}&key=AIzaSyDOy4GwW3OFxLYAAM1kA2hGYyr-MC_Qt84`
  );
}
