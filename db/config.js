const { Sequelize, DataTypes } = require("sequelize");

const db = new Sequelize("mysql://root:EciahaksmRizIyGjAHZLEbhShlXENJvR@mainline.proxy.rlwy.net:49042/railway")

module.exports = db