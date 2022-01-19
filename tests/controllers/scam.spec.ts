import { Request, Response } from "express"
import axios, { AxiosStatic } from "axios"
import { getScore } from "../../controllers/scam"
import db from "../mocks/db"

jest.mock("axios")

describe("Get score", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let responseObject = {}
  let responseStatus = 0

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockImplementation(function (status) {
        responseStatus = status
        return mockResponse
      }),
      json: jest.fn().mockImplementation(function (result) {
        responseObject = result
        return mockResponse
      })
    }
  })

  test("without range date", async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockResolvedValue({ status: 200, data: { score: 100 } })

    const insert = db.insert as jest.Mock
    insert.mockImplementation(() => ({ rows: [{ id: 1 }] }))

    mockRequest = {
      query: { domain: "sosafe.de" }
    }

    await getScore(mockRequest as Request, mockResponse as Response)
    console.debug("responseStatus: ", responseStatus);
    console.debug("responseObject: ", responseObject);
    expect(responseStatus).toBe(200)
    expect(responseObject).toEqual({ "score": 100 })
  })
})
