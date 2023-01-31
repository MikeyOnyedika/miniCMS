import { useReducer } from "react";
import { USER_COLLECTION_URL_BASE } from "../utils/baseURL";
import { useFetch } from "./useFetch";
import { RequestState } from '../utils/httpConsts'
import { useAuthContext } from '../contexts/AuthProvider'

const initialStatusState = {
    isLoading: false,
    isError: false,
    errorMsg: null
}

const initialState = {
    colContents: null,
    getStatus: { ...initialStatusState },
    postStatus: { ...initialStatusState }
}

const ACTION_TYPE = {
    BEGIN_GET_CONTENT: 'begin-get-content',
    GET_CONTENT_SUCCESS: 'get-content-success',
    GET_CONTENT_FAILED: 'get-content-failed',

    BEGIN_POST_CONTENT: 'begin-post-content',
    POST_CONTENT_SUCCESS: 'post-content-success',
    POST_CONTENT_FAILED: 'post-content-failed',


    BEGIN_UPDATE_CONTENT: 'begin-update-content',
    UPDATE_CONTENT_SUCCESS: 'update-content-success',
    UPDATE_CONTENT_FAILED: 'update-content-failed'
}

function reducerFn(state, action) {
    const actionType = action.type
    if (action.type === ACTION_TYPE.BEGIN_GET_CONTENT) {
        return { ...state, getStatus: { ...state.getStatus, isLoading: true } }
    } else if (actionType === ACTION_TYPE.GET_CONTENT_SUCCESS) {
        return { ...state, colContents: [...action.payload], getStatus: { isLoading: false, isError: false, errorMsg: null } }
    } else if (actionType === ACTION_TYPE.GET_CONTENT_FAILED) {
        return { ...state, getStatus: { isLoading: false, isError: true, errorMsg: action.payload } }
    } else if (actionType === ACTION_TYPE.BEGIN_POST_CONTENT) {
        console.log("post started")
        return { ...state, postStatus: { ...state.postStatus, isLoading: true } }
    } else if (actionType === ACTION_TYPE.POST_CONTENT_SUCCESS) {
        console.log("new item added")
        return { ...state, colContents: [...state.colContents, action.payload ], postStatus: { isLoading: false, isError: false, errorMsg: null } }
    } else if (actionType === ACTION_TYPE.POST_CONTENT_FAILED) {
        console.log("couldn't add new item")
        return { ...state, postStatus: { isLoading: false, isError: true, errorMsg: action.payload } }
    } else {
        throw new Error("Action does not match any known action type")
    }
}

export function useCollectionsContents(baseUrl, addStatusMessage) {
    const [state, dispatch] = useReducer(reducerFn, initialState)
    const { token } = useAuthContext()
    const { get, post, put, del } = useFetch({ requestURL: baseUrl, authToken: token })

    async function getCollectionContents(colName) {
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


    async function addCollectionContent(colName, body) {
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

    function updateCollectionContent() { }

    function deleteCollectionContent() { }

    return {
        getCollectionContents, addCollectionContent, updateCollectionContent, deleteCollectionContent,
        ...state,
    }

}