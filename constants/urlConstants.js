export const SERVER_IP_ADDRESS = "192.168.0.215";
export const SERVER_PORT = "3500";
export const SERVER_BASE_URL = `http://${SERVER_IP_ADDRESS}:${SERVER_PORT}/`;

export const BASE_AUTH_URL = `${SERVER_BASE_URL}users/`;
export const BASE_REFRESH_URL = `${BASE_AUTH_URL}refresh/`;

export const BASE_IMGBB_URL = "https://api.imgbb.com/1/upload";
export const BASE_IMGBB_DELETE_URL = "https://ibb.co/json";

export const JSON_HEADERS = { "Content-Type": "application/json" };
