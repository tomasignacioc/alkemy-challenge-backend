const express = require("express")
const app = express()
const cors = require("cors")
const { sequelize } = require("./connection")
const rateLimit = require("express-rate-limit")
const apicache = require("apicache")

const charRoutes = require("./routes/characters")
const movieRoutes = require("./routes/movies")
const genreRoutes = require("./routes/generos")
const authRoutes = require("./routes/login-register")

const port = process.env.PORT || 3000

// Rate limiting
const limiter = rateLimit({
    windowMs: 300000, // 5 minutos
    max: 50
})
// Init cache
let cache = apicache.middleware

app.set("trust proxy", 1)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
// ojo con usar cache aqui porque se guarda la cache del login y eso puede dar errores.
// por mas que se ponga el limiter o el cache en lineas separadas, se incluye todo dentro del objeto app
app.use("/api", limiter, charRoutes, movieRoutes, genreRoutes, authRoutes)


app.listen(port, async () => {
    console.log(`Server listening in port ${port}`);

    // conectar a la BBDD
    try {
        await sequelize.sync({ alter: true });
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})