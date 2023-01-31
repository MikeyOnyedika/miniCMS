import { useUserCollections } from "../hooks/useUserCollections"
import { useCollectionsContents } from '../hooks/useCollectionsContents'
import { USER_COLLECTION_URL_BASE } from '../utils/baseURL'
import { createContext } from "react";
import { useContext } from "react";
import { useStatusMessage } from '../hooks/useStatusMessage'

const UserContentContext = createContext();

export function useUserContentContext() {
    return useContext(UserContentContext)
}

function UserContentProvider({ children }) {
    const { addStatusMessage, statusMessageQueue } = useStatusMessage();
    const { collections, getCollections } = useUserCollections(USER_COLLECTION_URL_BASE, addStatusMessage);
    const { getCollectionContents, addCollectionContent, updateCollectionContent, deleteCollectionContent, getStatus: getColConStatus, colContents, postStatus: postColConStatus, delStatus: delColConStatus } = useCollectionsContents(USER_COLLECTION_URL_BASE, addStatusMessage);


    return (
        <UserContentContext.Provider value={{
            collections, getCollections, getCollectionContents,
            addCollectionContent, updateCollectionContent, deleteCollectionContent, addStatusMessage, statusMessageQueue, getColConStatus, postColConStatus, delColConStatus, colContents
        }}>
            {children}
        </UserContentContext.Provider>
    )
}

export default UserContentProvider