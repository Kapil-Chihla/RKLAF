import axios from 'axios';
import { API_BASE } from './api';

/** Public (unauthenticated) API client */
const publicApi = axios.create({ baseURL: API_BASE });

export default publicApi;
