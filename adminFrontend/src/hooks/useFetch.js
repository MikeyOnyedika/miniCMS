import { ResponseType } from '../utils/httpConsts'

export const useFetch = ({ requestURL, authToken }) => {
    async function get({ useToken, responseType = ResponseType.JSON }) {
        const options = {
            method: 'GET',
            headers: {
                Authentication: useToken === true ? `Bearer ${authToken}` : null
            }
        }
        const response = await _fetch({ requestURL, responseType, options })
        return response

    }

    async function post({ useToken, responseType = ResponseType.JSON, body = {} }) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authentication: useToken === true ? `Bearer ${authToken}` : null
            },
            body: JSON.stringify(body)
        }
        const response = await _fetch({ requestURL, responseType, options })
        return response
    }

    async function put({ useToken = true, responseType = ResponseType.JSON, itemId, updateBody }) {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authentication: useToken === true ? `Bearer ${authToken}` : null
            },
            body: JSON.stringify(updateBody)
        }
        const response = await _fetch({ requestURL: `${requestURL}/${itemId}`, responseType, options })
        return response
    }

    async function del({ useToken = true, responseType = ResponseType.JSON, itemId }) {
        const options = {
            method: 'DELETE',
            headers: {
                Authentication: useToken === true ? `Bearer ${authToken}` : null
            }
        }
        const response = await _fetch({ requestURL: `${requestURL}/${itemId}`, responseType, options })
        return response
    }

    async function _fetch({ url, responseType, options }) {
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
    }

    return {
        get, post, put, del
    }
}
