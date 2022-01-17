require("dotenv").config();
import axios from "axios"

const requestHandler = (req: any) => req

const responseHandler = (res: any) => res.data ?? res

const responseErrorHandler = (err: any) =>  Promise.reject(err)

const API = axios.create()

API.interceptors.request.use(requestHandler)
API.interceptors.response.use(responseHandler, responseErrorHandler)

export const getScore = async () => await API.post("https://api.scamadviser.cloud/v2/trust/batch/create", {
    "apikey": process.env.API_KEY,
    "domains": [
      "scamadviser.com"
    ]
  }
)
