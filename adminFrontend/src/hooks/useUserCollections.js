import { useFetch } from './useFetch'
import { RequestState } from '../utils/httpConsts'
import { useReducer } from "react"
import { useEffect } from "react"
import { useAuthContext } from '../contexts/AuthProvider'

const initialState = {
    collections: [],
    isLoading: true,
    isError: true,
    errorMsg: null
}

const ACTION_TYPE = {
    SET_ALL: 'set-all',
    SET_REQUEST_ERROR: 'set-request-error'
}

function reducerFunction(state, action) {
    const actionType = action.type
    if (actionType === ACTION_TYPE.SET_ALL) {
        return { ...state, collections: [...action.payload], isLoading: false, isError: false }
    } else if (actionType === ACTION_TYPE.SET_REQUEST_ERROR) {
        return { ...state, isLoading: false, isError: true, errorMsg: action.payload }
    } else {
        throw new Error("Action does not match any known action type")
    }
}

// this hook should manage the array of collections gotten from the database
export function useUserCollections(url, addStatusMessage) {
    const { token } = useAuthContext()
    const [collections, dispatch] = useReducer(reducerFunction, initialState)
    console.log("url: ", url, "token: ", token)
    const { get, post, put, del } = useFetch({ url, authToken: token })

    useEffect(() => {
        getCollections()
    }, [])

    async function getCollections() {
        try {
            const response = await get({ useToken: true })
            if (response.success === true) {
                console.log("collections gotten: ", response.data)
                dispatch({ type: ACTION_TYPE.SET_ALL, payload: data })
            } else {
                dispatch({ type: ACTION_TYPE.SET_REQUEST_ERROR, payload: response.message })
                addStatusMessage({ status: RequestState.FAILED, message: response.message })
            }
        } catch (err) {
            addStatusMessage({ status: RequestState.FAILED, message: err })
        }
    }

    return {
        collections
    }
}