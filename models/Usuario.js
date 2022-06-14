const { DataTypes } = require("sequelize")
const { sequelize } = require("../connection")

const Usuario = sequelize.define("Usuario", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false
})

module.exports = { Usuario }