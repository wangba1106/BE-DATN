'use strict'
/** @type {import('sequelize-cli').Migration} */

const UserMigration = require('./create-table-user')
const ProfileMigration = require('./create-table-profile')
const InterestMigration = require('./create-table-interest')
const UserInterestsMigration = require('./create-table-user-interests')
const FriendShipMigration = require('./create-table-friendship')

module.exports = {
  async up(queryInterface, Sequelize) {
    // User
    await UserMigration.up(queryInterface, Sequelize)
    // Profile
    await ProfileMigration.up(queryInterface, Sequelize)
    // Interests
    await InterestMigration.up(queryInterface, Sequelize)
    // UserInterests
    await UserInterestsMigration.up(queryInterface, Sequelize)
    // Friendship
    await FriendShipMigration.up(queryInterface, Sequelize)
  },

  async down(queryInterface, Sequelize) {
    // Friendship
    await FriendShipMigration.up(queryInterface, Sequelize)
    // UserInterests
    await UserInterestsMigration.down(queryInterface, Sequelize)
    // Interests
    await InterestMigration.down(queryInterface, Sequelize)
    // Profile
    await ProfileMigration.down(queryInterface, Sequelize)
    // User
    await UserMigration.down(queryInterface, Sequelize)
  }
}
