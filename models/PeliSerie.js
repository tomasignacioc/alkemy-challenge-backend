const { DataTypes } = require("sequelize")
const { sequelize } = require("../connection")

const PeliSerie = sequelize.define("PeliSerie", {
    imagen: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    fecha_de_creacion: {
        type: DataTypes.DATE,
        get: function () {
            return this.getDataValue("fecha_de_creacion").toLocaleDateString('en-GB')
        },
        allowNull: false,
    },
    calificacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isIn: {
                args: [[1, 2, 3, 4, 5]],
                msg: "Ingresar un valor del 1 al 5"
            }
        }
    },
}, {
    timestamps: false
})

module.exports = { PeliSerie }