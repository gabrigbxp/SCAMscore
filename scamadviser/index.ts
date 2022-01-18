require("dotenv").config();
import axios from "axios"

export const getScore = async (domain: unknown) => await axios.get(`https://api.scamadviser.cloud/v2/trust/single?apikey=${process.env.API_KEY}&domain=${domain}&refresh=true`)
