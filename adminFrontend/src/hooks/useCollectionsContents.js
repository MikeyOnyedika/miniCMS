import useBaseUrl from "./useBaseUrl";
// import { useFetch } from "./useFetch";

export function useCollectionsContents(baseUrl, colNames) {
    const { USER_COLLECTION_URL_BASE } = useBaseUrl()
    // const { get, post, put, delete} = useFetch(baseUrl)

    function getCollectionContents() {

    }
    function addCollectionContent() {

    }
    function updateCollectionContent() { }
    function deleteCollectionContent() { }

    return {
        getCollectionContents, addCollectionContent, updateCollectionContent, deleteCollectionContent
    }

}