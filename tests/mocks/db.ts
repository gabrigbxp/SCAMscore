jest.mock('pg', () => {
  class Pool {
    query() { return this }
  }
})

import * as db from "../../db"

jest.spyOn(db, 'query').mockImplementation(jest.fn())
jest.spyOn(db, 'insert').mockImplementation(jest.fn())

export default db
