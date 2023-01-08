function useBaseUrl() {
  const baseUrl = "http://localhost:5000/api/admin/";
  const fileServerBase = "http://localhost:4444/upload/";
  return { baseUrl, fileServerBase };
}

export default useBaseUrl;
