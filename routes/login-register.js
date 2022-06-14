const { Router } = require("express")
const router = Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { Usuario } = require("../models/Usuario")
const mailer = require("../middlewares/mailer")

router.post("/auth/register", async (req, res) => {
    const { email, password } = req.body

    try {
        const existeEmail = await Usuario.findOne({ where: { email } })
        if (existeEmail) {
            return res.status(400).send("El email ya está siendo utilizado")
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const usuario = await Usuario.create({
            email,
            password: hashedPassword
        })
        let idUsuario = usuario.id;
        let emailUsuario = usuario.email;

        mailer(emailUsuario)

        return res.status(200).send({ mensaje: "usuario creado!", data: { idUsuario, emailUsuario } })
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message)
    }
})


router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const usuario = await Usuario.findOne({ where: { email } })
        if (!usuario) return res.status(400).send("No existe un usuario asociado a ese email")

        const passwordCheck = await bcrypt.compare(password, usuario.password)
        if (!passwordCheck) return res.status(400).send("Contraseña incorrecta")

        // crear y asignar un token
        const token = jwt.sign({ id: usuario.id }, process.env.TOKEN_SECRET)
        res.header("auth-token", token).send(token)

    } catch (error) {

        return res.status(400).send(error.message)
    }
})

module.exports = router