import { Meal } from "./resources/meals";
import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

export type DatabaseSchema = {
  meals: Meal[]
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'dinnerdb.json')

const adapter = new JSONFile<DatabaseSchema>(file)
const db = new Low<DatabaseSchema>(adapter)

export const database = async () => {
  await db.read()
  db.data ||= { meals: [] }
  return db
}
