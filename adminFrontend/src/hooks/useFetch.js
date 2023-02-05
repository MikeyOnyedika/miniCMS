import { ResponseType } from '../utils/consts'

export const useFetch = ({ requestURL, authToken }) => {

    async function get(urlExtra = "", useToken = true, responseType = ResponseType.JSON) {
        const options = {
            method: 'GET',
            headers: {
                Authorization: useToken === true ? `Bearer ${authToken}` : null
            }
        }

        const response = await _fetch({ url: `${requestURL}/${urlExtra}`, responseType, options })

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
        const response = await _fetch({ url: `${requestURL}/${urlExtra}`, responseType, options })

        return response
    }

    async function put(urlExtra = "", body, useToken = true, responseType = ResponseType.JSON) {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: useToken === true ? `Bearer ${authToken}` : null
            },
            body: JSON.stringify(body)
        }
        const response = await _fetch({ url: `${requestURL}/${urlExtra}`, responseType, options })
        return response
    }

    async function del(urlExtra = "", useToken = true, responseType = ResponseType.JSON) {
        const options = {
            method: 'DELETE',
            headers: {
                Authorization: useToken === true ? `Bearer ${authToken}` : null
            }
        }
        const response = await _fetch({ url: `${requestURL}/${urlExtra}`, responseType, options })
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
        get, post, put, del
    }
}
