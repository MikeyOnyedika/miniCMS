
import { RequestState } from '../utils/consts'
import { useFetch } from './useFetch'
import { useReducer } from 'react'

export const initialStatusState = {
    isLoading: false,
    isError: false,
    errorMsg: null
}

export const ACTION_TYPE = {
    BEGIN_GET_CONTENT: 'begin-get-content',
    GET_CONTENT_SUCCESS: 'get-content-success',
    GET_CONTENT_FAILED: 'get-content-failed',

    BEGIN_POST_CONTENT: 'begin-post-content',
    POST_CONTENT_SUCCESS: 'post-content-success',
    POST_CONTENT_FAILED: 'post-content-failed',


    BEGIN_UPDATE_CONTENT: 'begin-update-content',
    UPDATE_CONTENT_SUCCESS: 'update-content-success',
    UPDATE_CONTENT_FAILED: 'update-content-failed',

    BEGIN_DELETE_CONTENT: 'begin-delete-content',
    DELETE_CONTENT_SUCCESS: 'update-delete-success',
    DELETE_CONTENT_FAILED: 'update-delete-failed'
}


export const initialState = {
    primaryState: null,
    getStatus: { ...initialStatusState },
    postStatus: { ...initialStatusState },
    updateStatus: { ...initialStatusState },
    delStatus: { ...initialStatusState },
}

function reducerFn(state, action) {
    const actionType = action.type
    if (action.type === ACTION_TYPE.BEGIN_GET_CONTENT) {
        return { ...state, getStatus: { ...state.getStatus, isLoading: true } }
    } else if (actionType === ACTION_TYPE.GET_CONTENT_SUCCESS) {
        return { ...state, primaryState: [...action.payload], getStatus: { isLoading: false, isError: false, errorMsg: null } }
    } else if (actionType === ACTION_TYPE.GET_CONTENT_FAILED) {
        return { ...state, getStatus: { isLoading: false, isError: true, errorMsg: action.payload } }
    } else if (actionType === ACTION_TYPE.BEGIN_POST_CONTENT) {
        return { ...state, postStatus: { ...state.postStatus, isLoading: true } }
    } else if (actionType === ACTION_TYPE.POST_CONTENT_SUCCESS) {
        return { ...state, primaryState: [...state.primaryState, action.payload], postStatus: { isLoading: false, isError: false, errorMsg: null } }
    } else if (actionType === ACTION_TYPE.POST_CONTENT_FAILED) {
        return { ...state, postStatus: { isLoading: false, isError: true, errorMsg: action.payload } }
    } else if (actionType === ACTION_TYPE.BEGIN_UPDATE_CONTENT) {
        return { ...state, updateStatus: { ...state.updateStatus, isLoading: true } }
    } else if (actionType === ACTION_TYPE.UPDATE_CONTENT_SUCCESS) {
        // replace the old item with the new updated item
        const copy = state.primaryState.map(item => {
            if (item._id === action.payload._id) {
                return action.payload
            }
            return item;
        })
        return { ...state, primaryState: [...copy], updateStatus: { isLoading: false, isError: false, errorMsg: null } }
    } else if (actionType === ACTION_TYPE.UPDATE_CONTENT_FAILED) {
        return { ...state, updateStatus: { isLoading: false, isError: true, errorMsg: action.payload } }
    } else if (actionType === ACTION_TYPE.BEGIN_DELETE_CONTENT) {

        return { ...state, delStatus: { ...state.delStatus, isLoading: true } }
    } else if (actionType === ACTION_TYPE.DELETE_CONTENT_SUCCESS) {
        // remove the deleted item from the collection
        const copy = state.primaryState.filter(item => item._id !== action.payload._id)
        return { ...state, primaryState: [...copy], delStatus: { isLoading: false, isError: false, errorMsg: null } }
    } else if (actionType === ACTION_TYPE.DELETE_CONTENT_FAILED) {
        return { ...state, delStatus: { isLoading: false, isError: true, errorMsg: action.payload } }
    } else {
        throw new Error("Action does not match any known action type")
    }
}


export function useListFromAPI(baseUrl, addStatusMessage, token) {
    const [state, dispatch] = useReducer(reducerFn, initialState)
    const { get, post, put, del } = useFetch({ requestURL: baseUrl, authToken: token })


    async function getListItems(colName = "") {
        try {
            dispatch({ type: ACTION_TYPE.BEGIN_GET_CONTENT })
            const response = await get(colName)
            if (response.success === true) {
                dispatch({ type: ACTION_TYPE.GET_CONTENT_SUCCESS, payload: response.data })
            } else {
                dispatch({ type: ACTION_TYPE.GET_CONTENT_FAILED, payload: response.message })
                addStatusMessage({ status: RequestState.FAILED, message: response.message })
            }
        } catch (err) {
            addStatusMessage({ status: RequestState.FAILED, message: err })
        }
    }


    async function addItemToList(colName, body) {
        try {
            dispatch({ type: ACTION_TYPE.BEGIN_POST_CONTENT })
            const response = await post(colName, body)
            if (response.success === true) {
                dispatch({ type: ACTION_TYPE.POST_CONTENT_SUCCESS, payload: response.data })
                addStatusMessage({ status: RequestState.SUCCESS, message: "Successfully added new item!" })
            } else {
                dispatch({ type: ACTION_TYPE.POST_CONTENT_FAILED, payload: response.message })
                addStatusMessage({ status: RequestState.FAILED, message: response.message.toString() })
            }
        } catch (err) {
            addStatusMessage({ status: RequestState.FAILED, message: err })
        }
    }

    async function updateListItem(colName, itemId, body) {
        try {
            dispatch({ type: ACTION_TYPE.BEGIN_UPDATE_CONTENT })
            const response = await put(`${colName}/${itemId}`, body)
            if (response.success === true) {
                dispatch({ type: ACTION_TYPE.UPDATE_CONTENT_SUCCESS, payload: response.data })
                addStatusMessage({ status: RequestState.SUCCESS, message: "Successfully edited item!" })
            } else {
                dispatch({ type: ACTION_TYPE.UPDATE_CONTENT_FAILED, payload: response.message })
                addStatusMessage({ status: RequestState.FAILED, message: response.message })
            }
        } catch (err) {
            addStatusMessage({ status: RequestState.FAILED, message: err })
        }
    }

    async function deleteListItem(colName, itemId = "") {
        try {
            dispatch({ type: ACTION_TYPE.BEGIN_DELETE_CONTENT })
            const response = await del(`${colName}/${itemId}`)
            if (response.success === true) {
                dispatch({ type: ACTION_TYPE.DELETE_CONTENT_SUCCESS, payload: response.data })
                addStatusMessage({ status: RequestState.SUCCESS, message: "Successfully deleted an item!" })
            } else {
                dispatch({ type: ACTION_TYPE.DELETE_CONTENT_FAILED, payload: response.message })
                addStatusMessage({ status: RequestState.FAILED, message: response.message.toString() })
            }
        } catch (err) {
            addStatusMessage({ status: RequestState.FAILED, message: err })
        }
    }

    return {
        getListItems, addItemToList, updateListItem, deleteListItem, state
    }

}