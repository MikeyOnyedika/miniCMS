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
    // TODO: fix the getstatus and of co of this hook

    async function get(colName = "", useToken = true, responseType = ResponseType.JSON) {
        const options = {
            method: 'GET',
            headers: {
                Authorization: useToken === true ? `Bearer ${authToken}` : null
            }
        }

        setGetStatus({ isLoading: true, isError: false, errorMsg: null })
        const response = await _fetch({ url: `${requestURL}/${colName}`, responseType, options })
        setGetStatus(false)

        return response
    }

    async function post(params) {
        if (!params?.useToken) {
            params.useToken = false
        }
        if (!params?.responseType) {
            params.responseType = ResponseType.JSON
        }
        if (!params?.body) {
            params.body = {}
        }
        const { useToken, responseType, body } = params
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: useToken === true ? `Bearer ${authToken}` : null
            },
            body: JSON.stringify(body)
        }
        setIsPostLoading(true)
        const response = await _fetch({ url: requestURL, responseType, options })
        setIsPostLoading(false)
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

    async function del({ useToken = true, responseType = ResponseType.JSON, itemId }) {
        const options = {
            method: 'DELETE',
            headers: {
                Authorization: useToken === true ? `Bearer ${authToken}` : null
            }
        }
        setIsDelLoading(true)
        const response = await _fetch({ url: `${requestURL}/${itemId}`, responseType, options })
        setIsDelLoading(false)
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
            return { success: false, message: `{ ${err.message} }` }
        }
    }

    return {
        get, post, put, del, getStatus, postStatus, putStatus, delStatus
    }
}
