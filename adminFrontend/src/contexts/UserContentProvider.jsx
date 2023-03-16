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

    const { collections, getCollections, getColStatus, deleteCollection, delColStatus, addCollection, addColStatus, updateCollection, updateColStatus } = useUserCollections(USER_COLLECTION_URL_BASE, addStatusMessage);

    const { colContents, getCollectionContents, addCollectionContent, updateCollectionContent, deleteCollectionContent, getColConStatus, addColConStatus, updateColConStatus, delColConStatus } = useCollectionsContents(USER_COLLECTION_URL_BASE, addStatusMessage);

    return (
        <UserContentContext.Provider value={{
            addStatusMessage,
            statusMessageQueue,


            collections,

            getCollections,
            addCollection,
            updateCollection,
            deleteCollection,
            getColStatus,
            addColStatus,
            updateColStatus,
            delColStatus,


            colContents,

            getCollectionContents,
            addCollectionContent,
            updateCollectionContent,
            deleteCollectionContent,

            getColConStatus,
            addColConStatus,
            updateColConStatus,
            delColConStatus
        }}>
            {children}
        </UserContentContext.Provider>
    )
}

export default UserContentProvider
