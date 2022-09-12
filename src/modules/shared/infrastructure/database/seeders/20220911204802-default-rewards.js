"use strict";
const { rewards } = require("./config/seedData");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Rewards", rewards);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Rewards", null, {});
  },
};
