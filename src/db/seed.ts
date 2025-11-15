import { db } from './connection.ts'
import { users, habits, entries, tags, habitTags } from './schema.ts'

const seed = async () => {
  console.log('🌱 Starting database seed...')

  try {
    console.log('Clearing existing database...')
    await db.delete(entries)
    await db.delete(users)
    await db.delete(habits)
    await db.delete(tags)
    await db.delete(habitTags)

    console.log('Creating demo users...')
    const [demoUser] = await db
      .insert(users)
      .values({
        email: 'demo@user.com',
        password: 'password',
        firstName: 'demo',
        lastName: 'user',
        username: 'demo user',
      })
      .returning()

    console.log('Creating tags...')
    const [healthTag] = await db
      .insert(tags)
      .values({ name: 'Health', color: '#f0f0f0' })
      .returning()

    console.log('Creating habits...')
    const [exerciseHabit] = await db
      .insert(habits)
      .values({
        userId: demoUser.id,
        name: 'Exercise',
        description: 'Daily Workout',
        frequency: 'daily',
        targetCount: 1,
      })
      .returning()

    await db.insert(habitTags).values({
      habitId: exerciseHabit.id,
      tagId: healthTag.id,
    })

    console.log('Adding completion entries')
    const today = new Date()
    today.setHours(12, 0, 0, 0)

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      await db.insert(entries).values({
        habitId: exerciseHabit.id,
        completionDate: date,
      })
    }

    console.log('✅ DB seeded successfully')
    console.log('user credentials:')
    console.log(`email: ${demoUser.email}`)
    console.log(`username: ${demoUser.username}`)
    console.log(`password: ${demoUser.password}`)
  } catch (error) {
    console.log('❌ seeding failed', error)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export default seed
