import { ENV } from '@/constants';
import axios from 'axios';

const instanceAxios = axios.create({ baseURL: `${ENV.SERVER_URL}${ENV.VERSION_API}` });

export const writeTokenRequest = async (token) => {
  if (token) instanceAxios.defaults.headers.common['X-BID-Token'] = token;

  return true;
};

export default instanceAxios;
