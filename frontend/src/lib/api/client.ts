import applyCaseMiddleware from "axios-case-converter"
import axios from "axios"

const options = {
  ignoreHeaders: true 
}

const client = applyCaseMiddleware(axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  }
}), options)

export default client
