import express from 'express'
import authRoutes from './routes/authRoutes.ts'
import habitRoutes from './routes/habitRoutes.ts'
import userRoutes from './routes/userRoutes.ts'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import { isTestEnv } from '../env.ts'
import { errorHandler } from './middleware/errorHandler.ts'

// Create Express application
const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  morgan('dev', {
    skip: () => isTestEnv(),
  })
)

// Health check endpoint - always good to have!
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Habit Tracker API',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/habits', habitRoutes)
app.use('/api/user', userRoutes)

app.use(errorHandler)
// Export the app for use in other modules (like tests)
export { app }

// Default export for convenience
export default app
