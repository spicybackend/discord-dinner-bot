import config from "../../config"
import { database } from "../database-schema"

export type Meal = {
  name: string
  recipeUrl?: string
}

export const addMeal = async ({ name, recipeUrl }) => {
  const db = await database()
  const { meals } = db.data
  meals.push({ name, recipeUrl })
  await db.write()
}

export const getAllMeals = async () => {
  const db = await database()
  const { meals } = db.data
  return meals
}

export const getWeeklyMeals = async () => {
  const db = await database()
  const { meals } = db.data

  const shuffledMeals = meals.sort((a, b) => 0.5 - Math.random());
  return shuffledMeals.slice(0, config.mealsPerWeek)
}
