import { useReducer } from "react";
import { USER_COLLECTION_URL_BASE } from "../utils/baseURL";
import { useFetch } from "./useFetch";
import { RequestState } from '../utils/httpConsts'


const initialState = {
    colContents: [],
    getStatus: {
        isLoading: false,
        isError: false,
        errorMsg: null
    },

}

const ACTION_TYPE = {
    SET_ALL: 'set-all',
    SET_REQUEST_ERROR: 'set-request-error',
    START_GET_ALL: 'start-get-all'
}

function reducerFn(state, action) {
    const actionType = action.type
    if (action.type === ACTION_TYPE.START_GET_ALL) {
        return { ...state, getStatus: { ...state.getStatus, isLoading: true } }
    } else if (actionType === ACTION_TYPE.SET_ALL) {
        return { colContents: [...action.payload], getStatus: { isLoading: false, isError: false, errorMsg: null } }
    } else if (actionType === ACTION_TYPE.SET_REQUEST_ERROR) {
        return { ...state, getStatus: { isLoading: false, isError: true, errorMsg: action.payload } }
    } else {
        throw new Error("Action does not match any known action type")
    }
}

export function useCollectionsContents(baseUrl, addStatusMessage) {
    const [state, dispatch] = useReducer(reducerFn, initialState)
    const { get, post, put, del } = useFetch(baseUrl)

    async function getCollectionContents(colName) {
        try {
            dispatch({ type: ACTION_TYPE.START_GET_ALL })
            const response = await get(colName)
            if (response.success === true) {
                console.log("collections gotten: ", response.data.collections)
                dispatch({ type: ACTION_TYPE.SET_ALL, payload: response.data.collections })
            } else {
                dispatch({ type: ACTION_TYPE.SET_REQUEST_ERROR, payload: response.message })
                addStatusMessage({ status: RequestState.FAILED, message: response.message })
            }
        } catch (err) {
            addStatusMessage({ status: RequestState.FAILED, message: err })
        }

    }

    function addCollectionContent() {

    }

    function updateCollectionContent() { }

    function deleteCollectionContent() { }

    return {
        getCollectionContents, addCollectionContent, updateCollectionContent, deleteCollectionContent,
        ...state,
    }

}