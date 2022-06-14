const { Router } = require("express")
const router = Router()
const { Genero, PeliSerie, Personaje } = require("../models/models")

router.get("/genres", async (req, res) => {
    try {
        const generos = await Genero.findAndCountAll()

        res.status(200).send(generos)
    } catch (error) {
        res.send(error)
    }
})

router.post("/genre/create", async (req, res) => {
    const { nombre, imagen, peliserie } = req.body

    try {
        const [genero, creado] = await Genero.findOrCreate({
            where: { nombre },
            defaults: {
                nombre,
                imagen
            }
        })

        peliserie.map(async (PoS) => {
            const dbPoS = await PeliSerie.findOne({
                where: {
                    titulo: PoS
                }
            })
            genero.addPeliSerie(dbPoS)
        })

        if (creado) {
            res.status(201).send({ message: "genero creado con exito", genero })
        } else {
            res.status(400).send({ message: "el genero ya existe!" })
        }

    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get("/genre/:id/detail", async (req, res) => {
    const { id } = req.params

    try {
        const genreDetail = await Genero.findOne({
            where: { id },
            include: PeliSerie,
        })

        res.status(200).send(genreDetail)
    } catch (error) {
        res.send(error)
    }
})

module.exports = router