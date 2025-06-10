const { faker } = require('@faker-js/faker');

function createUser() {
  return {
    email: faker.internet.email(),
    password: 'password123',
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    home_address: faker.location.streetAddress(),
  };
}

function createDentist() {
  return {
    name: `Dr. ${faker.person.fullName()}`,
    specialty: `${faker.word.adjective()} Dentistry`,
    available_days: faker.helpers.arrayElements(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], 2),
  };
}

function createAppointment(userId, dentistId) {
  return {
    user_id: userId,
    dentist_id: dentistId,
    appointment_date: faker.date.future().toISOString().slice(0, 10),
    time_slot: faker.helpers.arrayElement(['09:00', '10:00', '11:00', '13:00', '14:00']),
    status: faker.helpers.arrayElement(['scheduled', 'cancelled', 'completed']),
  };
}

module.exports = { createUser, createDentist, createAppointment };