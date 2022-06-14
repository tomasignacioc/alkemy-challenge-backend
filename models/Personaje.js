const { DataTypes } = require("sequelize")
const { sequelize } = require("../connection")

const Personaje = sequelize.define("Personaje", {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "Por favor ingresar un nombre"
            }
        }
    },
    edad: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    peso: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    historia: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: false
})

module.exports = { Personaje }