import { rest } from 'msw'
import { getAllCollections } from './sampleAPIResponse'
import {MOCK_URL_BASE} from '../utils/baseURL'

export const handlers = [
    rest.get(`${MOCK_URL_BASE}`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json( getAllCollections ))
    })
]
