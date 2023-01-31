import { useState } from 'react'
import { ResponseType } from '../utils/httpConsts'

export const useFetch = ({ requestURL, authToken }) => {

    const initialState = {
        isLoading: false,
        isError: false,
        errorMsg: null
    }

    const [getStatus, setGetStatus] = useState(initialState)
    const [postStatus, setPostStatus] = useState(initialState)
    const [putStatus, setPutStatus] = useState(initialState)
    const [delStatus, setDelStatus] = useState(initialState)
    // TODO: fix the getstatus and  co of this hook

    async function get(urlExtra = "", useToken = true, responseType = ResponseType.JSON) {
        const options = {
            method: 'GET',
            headers: {
                Authorization: useToken === true ? `Bearer ${authToken}` : null
            }
        }

        setGetStatus({ isLoading: true, isError: false, errorMsg: null })
        const response = await _fetch({ url: `${requestURL}/${urlExtra}`, responseType, options })
        setGetStatus({ isLoading: false, isError: !response.success, errorMsg: response.message })

        return response
    }

    async function post(urlExtra = "", body, useToken = true, responseType = ResponseType.JSON) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: useToken === true ? `Bearer ${authToken}` : null
            },
            body: JSON.stringify(body)
        }
        setPostStatus({ isLoading: true, isError: false, errorMsg: null })
        const response = await _fetch({ url: `${requestURL}/${urlExtra}`, responseType, options })
        setPostStatus({ isLoading: false, isError: !response.success, errorMsg: response.message })

        return response
    }

    async function put({ useToken = true, responseType = ResponseType.JSON, itemId, updateBody }) {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: useToken === true ? `Bearer ${authToken}` : null
            },
            body: JSON.stringify(updateBody)
        }
        setIsPutLoading(true)
        const response = await _fetch({ url: `${requestURL}/${itemId}`, responseType, options })
        setIsPutLoading(false)
        return response
    }

    async function del(urlExtra = "", useToken = true, responseType = ResponseType.JSON) {
        const options = {
            method: 'DELETE',
            headers: {
                Authorization: useToken === true ? `Bearer ${authToken}` : null
            }
        }
        setDelStatus({ isLoading: true, isError: false, errorMsg: null })
        const response = await _fetch({ url: `${requestURL}/${urlExtra}`, responseType, options })
        setDelStatus({ isLoading: false, isError: !response.success, errorMsg: response.message })
        return response
    }

    async function _fetch({ url, responseType, options }) {
        try {
            const response = await fetch(url, options)

            switch (responseType) {
                case ResponseType.JSON:
                    return await response.json();
                case ResponseType.BLOB:
                    return await response.blob()
                case ResponseType.FORM_DATA:
                    return await response.formData()
                case ResponseType.TEXT:
                    return await response.text()
                case ResponseType.ARRAY_BUFFER:
                    return await response.arrayBuffer()
                default:
                    throw new Error("Response Type provided does not match any known response type")
            }
        } catch (err) {
            return { success: false, message: `{ ${err} }` }
        }
    }

    return {
        get, post, put, del, getStatus, postStatus, putStatus, delStatus
    }
}
