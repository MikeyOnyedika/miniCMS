import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFetch } from '../hooks/useFetch'
import { server } from '../mocks/server'
import { token } from '../mocks/sampleRequestData'
import { act } from 'react-dom/test-utils'
import { fetch } from 'cross-fetch'
import { MOCK_URL_BASE } from '../utils/baseURL'

describe("useFetch", () => {
    global.fetch = fetch;

    beforeAll(() => {
        server.listen({ onUnhandledRequest: 'error' })
    })

    afterAll(() => server.close())

    afterEach(() => server.resetHandlers())

    test("should run a get collections", async () => {
        const { result } = renderHook(() => useFetch({ authToken: token, requestURL: MOCK_URL_BASE }))
        await act(async () => {
            const { get } = result.current
            const response = await get()
            console.log(response)
            expect(response).toBeDefined()
        })
    })

    test("should successfully return items from an endpoint", async () => {
        const { result } = renderHook(() => useFetch({ authToken: token, requestURL: MOCK_URL_BASE }))
        await act(async () => {
            const { get } = result.current
            const response = await get()
            console.log("%o", response)
            expect(response.success).toBe(true)
        })
    })


    test("should successfully add new item to an endpoint ", async () => {
        const { result } = renderHook(() => useFetch({ authToken: token, requestURL: MOCK_URL_BASE }))
        await act(async () => {
            const { post } = result.current
            const response = await post({ useToken: true, body: {
                collectionName: "customer",
                fields: {
                    name: {
                        type: "string",
                        required: 'true',
                        unique: true
                    },
                    "house-address": {
                        type: "[]",
                        required: true
                    }
                },
                config: {
                    includeTimeStamps: true
                }
            } })
            console.log("%o", response)
            expect(response.success).toBe(true)
        })
    })
})