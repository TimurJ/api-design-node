import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.ts'
import {
  createHabit,
  getUserHabits,
  updateHabit,
} from '../controllers/habitController.ts'
import { z } from 'zod'
import { validateBody } from '../middleware/validation.ts'

const createHabitSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.string(),
  targetCount: z.number(),
  tagIds: z.array(z.string()).optional(),
})

const router = Router()

router.use(authenticateToken)

router.get('/', getUserHabits)

router.patch('/:id', updateHabit)

router.get('/:id', (req, res) => {
  res.json({ message: 'got one habit' })
})

router.post('/', validateBody(createHabitSchema), createHabit)

router.delete('/:id', (req, res) => {
  res.json({ message: 'deleted habit' })
})

router.post('/:id/complete', (req, res) => {
  res.json({ message: 'completed habit' })
})

export default router
