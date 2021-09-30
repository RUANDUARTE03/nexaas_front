import Axios from 'axios';

function getAxiosInstance() {
  return Axios.create();
}

export function get(url: string) {
  const axios = getAxiosInstance();

  return axios.get(url);
}
