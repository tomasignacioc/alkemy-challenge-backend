const { Router } = require("express")
const { Op } = require("sequelize")
const router = Router()
const { Genero, PeliSerie, Personaje } = require("../models/models")
const verify = require("../middlewares/verifyToken")


router.get("/characters", verify, async (req, res) => {
    try {
        const personajes = await Personaje.findAndCountAll({
            attributes: ["nombre", "imagen"]
        })

        res.status(200).send(personajes)
    } catch (error) {
        res.send(error)
    }
})

router.post("/character/create", verify, async (req, res) => {
    const { nombre, edad, peso, historia } = req.body

    try {
        const [personaje, creado] = await Personaje.findOrCreate({
            where: { nombre: nombre },
            defaults: {
                nombre,
                edad,
                peso,
                historia
            },
            include: [PeliSerie]
        })

        if (creado) {
            res.status(201).send({ message: "personaje creado con exito", personaje })
        } else {
            res.status(400).send({ message: "el personaje ya existe!" })
        }

    } catch (error) {
        res.status(400).send(error)
    }
})

router.patch("/character/:id/update", verify, async (req, res) => {
    const { nombre, edad, peso, historia, peliserie } = req.body
    const { id } = req.params

    try {
        const charToUpdate = await Personaje.update({
            nombre,
            edad,
            peso,
            historia,
        }, {
            where: { id }
        })

        if (peliserie) {
            const character = await Personaje.findOne({ where: { id } })

            peliserie.map(async (PoS) => {
                const dbPoS = await PeliSerie.findOne({
                    where: {
                        titulo: PoS
                    }
                })
                character.addPeliSerie(dbPoS)
            })
        }

        res.status(200).send({ message: "Personaje actualizado", charToUpdate })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.delete("/character/:id/delete", verify, async (req, res) => {
    const { id } = req.params

    try {
        const charToDestroy = await Personaje.destroy({
            where: { id }
        })

        if (charToDestroy) {
            res.status(200).send({ message: "personaje eliminado" })
        } else {
            res.status(404).send({ message: "el personaje ya se ha eliminado o no se encuentra en BBDD" })
        }

    } catch (error) {
        res.status(400).send(error)
    }
})

router.get("/character/:id/detail", verify, async (req, res) => {
    const { id } = req.params

    try {
        const characterDetail = await Personaje.findOne({
            where: { id },
            include: [{
                model: PeliSerie,
                through: {
                    attributes: []
                }
            }],
        })

        res.status(200).send(characterDetail)
    } catch (error) {
        res.send(error)
    }
})

router.get("/characters/search", verify, async (req, res) => {
    const { name, age, movieId, weight } = req.query

    try {
        const result = movieId ? await Personaje.findAll({
            where: {
                [Op.or]: [
                    {
                        nombre: {
                            [Op.iLike]: name
                        }
                    },
                    {
                        edad: {
                            [Op.eq]: age
                        }
                    },
                    {
                        peso: {
                            [Op.eq]: weight
                        }
                    },
                ],
            },
            include: [{
                model: PeliSerie,
                through: {
                    where: {
                        PeliSerieId: {
                            [Op.in]: JSON.parse(movieId)
                        }
                    },
                },
            }]
        }) :
            await Personaje.findAll({
                where: {
                    [Op.or]: [
                        {
                            nombre: {
                                [Op.iLike]: name
                            }
                        },
                        {
                            edad: {
                                [Op.eq]: age
                            }
                        },
                        {
                            peso: {
                                [Op.eq]: weight
                            }
                        },
                    ],
                },
                include: PeliSerie
            })

        res.status(200).send(result)
    } catch (error) {
        res.status(404).send(error.message)
    }
})

module.exports = router