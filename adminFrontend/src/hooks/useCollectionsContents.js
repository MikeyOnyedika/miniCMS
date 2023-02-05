import { useListFromAPI } from './useListFromAPI'
import { useAuthContext } from '../contexts/AuthProvider'

export function useCollectionsContents(baseUrl, addStatusMessage) {
    const { token } = useAuthContext()

    const { getListItems, deleteListItem, addItemToList, updateListItem, state } = useListFromAPI(baseUrl, addStatusMessage, token)

    return {
        getCollectionContents: getListItems,
        addCollectionContent: addItemToList,
        updateCollectionContent: updateListItem,
        deleteCollectionContent: deleteListItem,
        colContents: state.primaryState,
        getColConStatus: state.getStatus,
        addColConStatus: state.postStatus,
        updateColConStatus: state.updateStatus,
        delColConStatus: state.delStatus
    }
}