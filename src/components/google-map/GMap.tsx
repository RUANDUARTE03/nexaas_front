import {
  GoogleMap,
  useJsApiLoader,
  Marker,
} from '@react-google-maps/api';
import { memo } from 'react';

const containerStyle = {
  width: '100%',
  height: '300px',
};

function GMap({ lat, lng }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey:
      'AIzaSyDOy4GwW3OFxLYAAM1kA2hGYyr-MC_Qt84',
  });

  return isLoaded && lat && lng ? (
    <div className="ch-card">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={new google.maps.LatLng(lat, lng)}
        zoom={14}
      >
        <Marker
          position={new google.maps.LatLng(lat, lng)}
        />
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
}

export default memo(GMap);
