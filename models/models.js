const { Genero } = require("./Genero")
const { PeliSerie } = require("./PeliSerie")
const { Personaje } = require("./Personaje")

// Relations
Personaje.belongsToMany(PeliSerie, { through: "Apariciones", timestamps: false })
PeliSerie.belongsToMany(Personaje, { through: "Apariciones", timestamps: false })
Genero.belongsToMany(PeliSerie, { through: "GeneroPeliculas", timestamps: false })
PeliSerie.belongsToMany(Genero, { through: "GeneroPeliculas", timestamps: false })

module.exports = {
    Genero,
    PeliSerie,
    Personaje
}