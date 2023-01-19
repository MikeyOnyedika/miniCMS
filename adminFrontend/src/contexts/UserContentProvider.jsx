import { useUserCollections } from "../hooks/useUserCollections"
import { useCollectionsContents } from '../hooks/useCollectionsContents'
import useBaseUrl from '../hooks/useBaseUrl'
import { createContext } from "react";
import { useContext } from "react";
import { useStatusMessage } from '../hooks/useStatusMessage'

const UserContentContext = createContext();

export function useUserContentContext() {
    return useContext(UserContentContext)
}

function UserContentProvider({ children }) {
    const { USER_COLLECTION_URL_BASE } = useBaseUrl()
    const { addStatusMessage, statusMessageQueue } = useStatusMessage();
    const { collections, addCollection, deleteCollection } = useUserCollections(USER_COLLECTION_URL_BASE, addStatusMessage);
    const { getCollectionContents, addCollectionContent, updateCollectionContent, deleteCollectionContent } = useCollectionsContents(USER_COLLECTION_URL_BASE, addStatusMessage);

    return (
        <UserContentContext.Provider value={{
            collections, addCollection, deleteCollection, getCollectionContents, getCollectionContents,
            addCollectionContent, updateCollectionContent, deleteCollectionContent, addStatusMessage, statusMessageQueue
        }}>
            {children}
        </UserContentContext.Provider>
    )
}

export default UserContentProvider