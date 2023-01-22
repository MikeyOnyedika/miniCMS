import { rest } from 'msw'
import { getAllCollections } from './sampleAPIResponse'
import { MOCK_URL_BASE } from '../utils/baseURL'

export const handlers = [
    rest.get(`${MOCK_URL_BASE}`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(getAllCollections))
    }),
    rest.post(MOCK_URL_BASE, async (req, res, ctx) => {
        const body = await req.json()
        if (!body.collectionName) {
            return res(ctx.status(201), ctx.json({ success: false, message: "CollectionName empty" }))
        }

        return res(ctx.status(201), ctx.json({ success: true, data: body}))
    })
]
