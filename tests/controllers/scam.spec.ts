import { NextFunction, Request, Response } from "express"
import axios from "axios"
import { getScore } from "../../controllers/scam"
import BusinessError from "../../errors/BusinessError"
import db from "../mocks/db"

jest.mock("axios")

describe("Get score", () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>
  const domain = "sosafe.de"
  const next = (() => { }) as NextFunction

  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let responseObject = {}
  let responseStatus = 0
  const score = { score: 100 }

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockImplementation(status => {
        responseStatus = status
        return mockResponse
      }),
      json: jest.fn().mockImplementation(result => {
        responseObject = result
        return mockResponse
      })
    }

    mockedAxios.get.mockResolvedValue({ status: 200, data: score })
  })

  test("Responds 200 without range date", async () => {
    const insert = db.insert as jest.Mock
    insert.mockImplementation(() => ({ rows: [{ id: 1 }] }))

    mockRequest = {
      query: { domain }
    }

    await getScore(mockRequest as Request, mockResponse as Response, next)

    expect(db.query).toHaveBeenCalledTimes(0)
    expect(db.insert).toHaveBeenCalledTimes(1)
    expect(db.insert).toHaveBeenCalledWith([domain, expect.any(Date), 100])

    expect(responseStatus).toBe(200)
    expect(responseObject).toEqual(score)
  })

  test("Responds 200 with '2022-01-10' as 'from' date", async () => {
    const insert = db.insert as jest.Mock
    insert.mockImplementation(() => ({ rows: [{ id: 4 }] }))

    const history = [
      {
        date: "2022-01-10T03:00:00.000Z",
        score: "100"
      },
      {
        date: "2022-01-11T03:00:00.000Z",
        score: "100"
      },
      {
        date: "2022-01-12T03:00:00.000Z",
        score: "100"
      }
    ]

    const query = db.query as jest.Mock
    query.mockImplementation(() => ({ rows: history }))

    mockRequest = {
      query: { domain, from: "2022-01-10" }
    }

    await getScore(mockRequest as Request, mockResponse as Response, next)

    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith("select \"date\", score from public.score where date >= '2022-01-10' and id <> 4 order by \"date\" asc")

    expect(db.insert).toHaveBeenCalledTimes(1)
    expect(db.insert).toHaveBeenCalledWith([domain, expect.any(Date), 100])

    expect(responseStatus).toBe(200)
    expect(responseObject).toEqual({ ...score, history })
  })

  test("Responds 200 with '2022-01-12' as 'to' date", async () => {
    const insert = db.insert as jest.Mock
    insert.mockImplementation(() => ({ rows: [{ id: 4 }] }))

    const history = [
      {
        date: "2022-01-10T03:00:00.000Z",
        score: "100"
      },
      {
        date: "2022-01-11T03:00:00.000Z",
        score: "100"
      },
      {
        date: "2022-01-12T03:00:00.000Z",
        score: "100"
      }
    ]

    const query = db.query as jest.Mock
    query.mockImplementation(() => ({ rows: history }))

    mockRequest = {
      query: { domain, to: "2022-01-12" }
    }

    await getScore(mockRequest as Request, mockResponse as Response, next)

    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith("select \"date\", score from public.score where date <= '2022-01-12' and id <> 4 order by \"date\" asc")

    expect(db.insert).toHaveBeenCalledTimes(1)
    expect(db.insert).toHaveBeenCalledWith([domain, expect.any(Date), 100])

    expect(responseStatus).toBe(200)
    expect(responseObject).toEqual({ ...score, history })
  })

  test("Responds 200 with '2022-01-10' as 'from' and '2022-01-12' as 'to' date", async () => {
    const insert = db.insert as jest.Mock
    insert.mockImplementation(() => ({ rows: [{ id: 4 }] }))

    const history = [
      {
        date: "2022-01-10T03:00:00.000Z",
        score: "100"
      },
      {
        date: "2022-01-11T03:00:00.000Z",
        score: "100"
      },
      {
        date: "2022-01-12T03:00:00.000Z",
        score: "100"
      }
    ]

    const query = db.query as jest.Mock
    query.mockImplementation(() => ({ rows: history }))

    mockRequest = {
      query: { domain, from: "2022-01-10", to: "2022-01-12" }
    }

    await getScore(mockRequest as Request, mockResponse as Response, next)

    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith("select \"date\", score from public.score where date between '2022-01-10' and '2022-01-12' and id <> 4 order by \"date\" asc")

    expect(db.insert).toHaveBeenCalledTimes(1)
    expect(db.insert).toHaveBeenCalledWith([domain, expect.any(Date), 100])

    expect(responseStatus).toBe(200)
    expect(responseObject).toEqual({ ...score, history })
  })

  test("Throw exception with status 400 if 'from' is '2022-01-'", async () => {
    let error!: BusinessError

    mockRequest = {
      query: { domain, from: "2022-01-" }
    }

    try {
      await getScore(mockRequest as Request, mockResponse as Response, next)
    } catch (e) {
      error = e as BusinessError
    }

    expect(db.query).toHaveBeenCalledTimes(0)
    expect(db.insert).toHaveBeenCalledTimes(0)

    expect(error instanceof BusinessError).toBe(true)
    expect(error.code).toBe(400)
    expect(error.message).toEqual("'from' field is invalid, should be a date with format YYYY-MM-DD")
  })
})
