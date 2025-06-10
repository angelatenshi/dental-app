const { Pool } = require('pg');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const { createUser, createDentist, createAppointment } = require('./factories');
require('dotenv').config();

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});


async function seed() {
    try {
        await db.query('TRUNCATE TABLE appointments, dentists, users RESTART IDENTITY CASCADE');

        //users
        const userIds = [];
        for (let i = 0; i < 5; i++) {
            const u = createUser();
            const hashed = await bcrypt.hash(u.password, 10);
            const res = await db.query(
            `INSERT INTO users (email, password, first_name, last_name, home_address)
            VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [u.email, hashed, u.first_name, u.last_name, u.home_address]
            );
            userIds.push(res.rows[0].id);
        }

        //dentists
        const dentistIds = [];
        for (let i = 0; i < 10; i++) {
            const d = createDentist();
            const res = await db.query(
            'INSERT INTO dentists (name, specialty, available_days) VALUES ($1, $2, $3) RETURNING id',
            [d.name, d.specialty, d.available_days]
            );
            dentistIds.push(res.rows[0].id);
        }

        //appointments
        for (let i = 0; i < 10; i++) {
            const userId = faker.helpers.arrayElement(userIds);
            const dentistId = faker.helpers.arrayElement(dentistIds);

            const appointment = createAppointment(userId, dentistId);

            await db.query(
            'INSERT INTO appointments (user_id, dentist_id, appointment_date, time_slot, status) VALUES ($1, $2, $3, $4, $5)',
            [
                appointment.user_id,
                appointment.dentist_id,
                appointment.appointment_date,
                appointment.time_slot,
                appointment.status
            ]
            );
        }

        console.log('Done seeding!');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await db.end();
    }
}

seed();
