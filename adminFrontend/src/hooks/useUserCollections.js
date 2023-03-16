import { useListFromAPI } from './useListFromAPI'
import { useAuthContext } from '../contexts/AuthProvider'

// this hook should manage the array of collections gotten from the database
export function useUserCollections(baseUrl, addStatusMessage) {
    const { token } = useAuthContext()

    const { getListItems, deleteListItem, addItemToList, updateListItem, state } = useListFromAPI(baseUrl, addStatusMessage, token)

    async function addCollection(body) {
        return await addItemToList("", body)
    }

    return {
        getCollections: getListItems,
        addCollection,
        updateCollection: updateListItem,
        deleteCollection: deleteListItem,
        collections: state.primaryState,
        getColStatus: state.getStatus,
        addColStatus: state.postStatus,
        updateColStatus: state.updateStatus,
        delColStatus: state.delStatus
    }
}