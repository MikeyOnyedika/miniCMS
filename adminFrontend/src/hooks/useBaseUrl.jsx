function useBaseUrl() {
  const MAIN_CONTENT_BASE = "http://localhost:5000/api"
  const AUTH_URL_BASE = `${MAIN_CONTENT_BASE}/admin/auth`;
  const USER_COLLECTION_URL_BASE = `${MAIN_CONTENT_BASE}/content`
  const FILE_SERVER_BASE = "http://localhost:4444/upload/";
  return { FILE_SERVER_BASE, AUTH_URL_BASE, USER_COLLECTION_URL_BASE };
}

export default useBaseUrl;