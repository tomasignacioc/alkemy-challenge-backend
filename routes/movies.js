const { Router } = require("express")
const { Op } = require("sequelize")
const router = Router()
const { Genero, PeliSerie, Personaje } = require("../models/models")
const verify = require("../middlewares/verifyToken")

router.get("/movies", verify, async (req, res) => {
    try {
        const peliculas = await PeliSerie.findAndCountAll({
            attributes: ["imagen", "titulo", "fecha_de_creacion"]
        })

        res.status(200).send(peliculas)
    } catch (error) {
        res.send(error)
    }
})

router.post("/movie/create", verify, async (req, res) => {
    const { imagen, titulo, fecha_de_creacion, calificacion } = req.body

    try {
        const [peliOSerie, creado] = await PeliSerie.findOrCreate({
            where: { titulo },
            defaults: {
                imagen,
                titulo,
                fecha_de_creacion,
                calificacion
            },
            include: [Personaje]
        })

        if (creado) {
            res.status(201).send({ message: "pelicula/serie creada con exito", peliOSerie })
        } else {
            res.status(400).send({ message: "la pelicula/serie ya existe!" })
        }

    } catch (error) {
        res.status(400).send(error)
    }
})

router.patch("/movie/:id/update", verify, async (req, res) => {
    const { imagen, titulo, fecha_de_creacion, calificacion, personajes } = req.body
    const { id } = req.params

    try {
        const movieToUpdate = await PeliSerie.update({
            imagen,
            titulo,
            fecha_de_creacion,
            calificacion
        }, {
            where: { id }
        })

        // TypeError: Cannot read properties of undefined (reading 'toLocaleDateString')
        // if (personajes) {
        //     const movie = await PeliSerie.findOne({ where: { id } })

        //     personajes.map(async (personaje) => {
        //         const dbPer = await Personaje.findOne({
        //             where: {
        //                 nombre: personaje
        //             }
        //         })
        //         movie.addPersonaje(dbPer)
        //     })
        // }

        res.status(200).send({ message: "pelicula/serie actualizada", movieToUpdate })
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message)
    }
})

router.delete("/movie/:id/delete", verify, async (req, res) => {
    const { id } = req.params

    try {
        const movieToDestroy = await PeliSerie.destroy({
            where: { id }
        })

        if (movieToDestroy) {
            res.status(200).send({ message: "pelicula/serie eliminada" })
        } else {
            res.status(404).send({ message: "la pelicula ya se ha eliminado o no se encuentra en BBDD" })
        }

    } catch (error) {
        res.status(400).send(error)
    }
})

router.get("/movie/:id/detail", verify, async (req, res) => {
    const { id } = req.params

    try {
        const movieDetail = await PeliSerie.findOne({
            where: { id },
            include: [{
                model: Personaje,
                through: {
                    attributes: []
                }
            }],
        })

        res.status(200).send(movieDetail)
    } catch (error) {
        res.send(error)
    }
})

router.get("/movies/search", verify, async (req, res) => {
    const { name, genreId, order } = req.query

    try {
        const result = await PeliSerie.findAll({
            where: {
                [Op.or]: [
                    {
                        titulo: {
                            [Op.substring]: name
                        }
                    },
                ]
            },
            order: [['fecha_de_creacion', order || 'DESC']],
            include: [{
                model: Genero,
                through: {
                    where: {
                        GeneroId: {
                            [Op.in]: JSON.parse(genreId)
                        }
                    },
                    attributes: []
                },
                attributes: ["nombre", "imagen"],
            }]
        })
        res.status(200).send(result)
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message)
    }
})

module.exports = router