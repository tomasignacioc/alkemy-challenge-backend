const { DataTypes } = require("sequelize")
const { sequelize } = require("../connection")

const Genero = sequelize.define("Genero", {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: false
})

module.exports = { Genero }