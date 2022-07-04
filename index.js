//Requerimos express
const express = require("express")

const bodyParser = require("body-parser")

//Creamos nuestro modelo Pokemon

const mongoose = require("mongoose")

//Conectarnos con Mongodb

mongoose.connect("mongodb://localhost:27017/poke")
    .then(() => console.log("Conectado a la DB poke"))
    .catch(console.log)

const Schema = mongoose.Schema

const pokemonSchema = new Schema({
    name: String,
    url: String,
    type: String
})

const pokemonModel = mongoose.model("Pokemon", pokemonSchema)


//Inicializamos la app
const app = express()

//Nos ayuda a tener datos dentro de req.body
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


//Agregamos un middleware a todas las peticiones que acceden a mi server
app.use(ironLogger)

//Configuracion de views/hbs

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

//Metodos, rutas(query, params)

//app.METHOD("PATH", handler/cb)

//localhost:3001/users/Nombre del Usuario
//localhost:3001/users/SamPetherick1898

// app.get("/users/SamPetherick1898", (request, response) => {
//     response.send("<h1>SamPetherick1898</h1>")
// })


//Middlewares Es una funcion que se ejecuta en el flujo de comunicacion

function holaMundo(req, res, next) {
    console.log("HOLA MUNDO")
    req.cuerpo = { "ironhack": 2022 }
    next()
}

function verificarPassword(req, res, next) {
    const password = req.params.password
    //Nos envia a la siguiente funcion
    if (password === "contrasena") {
        console.log("Estas autorizado")
        next()
    } else {
        console.log("Contrasena incorrecta")
        res.send("<h1>Contrasea incorrecta</h1>")
    }
}

//loggers console.log("")
function ironLogger(req, res, next) {
    console.log("🐛🐛🐛 ==> Peticion realizada ", new Date())
    next()
}

function verificarRol(req, res, next) {
    //Admin
    //User
    //Employee
    console.log("Verificar role")
    const usuario = req.params.usuario
    console.log(usuario)
    if (usuario === "Horacio") {
        req.role = "Admin"
    } else if (usuario === "Moy") {
        req.role = "User"
    } else if (usuario === "Fer") {
        req.role = "Employee"
    } else {
        req.role = "Visitante"
    }

    next()
}

app.get("/nombreMayusculas/:password/:usuario", verificarPassword, verificarRol, (req, res) => {

    res.send(`<h1>${req.role}</h1>`)
})


//Params
// http://localhost:3001/users/harlandlohora
app.get("/users/:usuario", (req, res) => {
    //filter = Filtra datos
    const users = [
        {
            username: "hleonn",
            name: "Horacio Leon"
        },
        {
            username: "hleonn",
            name: "Horacio Leon #2"
        },
        {
            username: "SamPetherick1898",
            name: "Samuel Maganha"
        },
        {
            username: "SandyLOC",
            name: "Sandra Lopez"
        },
        {
            username: "vargasrangel",
            name: "Moises Vargas"
        },
        {
            username: "fernandaGuadarrama",
            name: "Fer G."
        },
        {
            username: "valmejia",
            name: "Valeria Mejia"
        },
        {
            username: "enrique",
            name: "Enrique"
        },
    ]

    console.log(req.params.usuario)

    const dataUsuario = users.filter((user) => {
        return user.username === req.params.usuario
    })
    console.log(dataUsuario)
    res.send(`<h2>Vista del usuario: ${dataUsuario[0].name}</h2>`)
})

//req.params
app.get("/publicaciones/:publicadasEn/:hechasPor", (req, res) => {
    console.log(req.params)
    res.end()
})

//query
//localhost:3001/casas?donde=Mexico&cuando=Julio&precio=2523

app.get("/casas", (req, res) => {
    console.log(req.query)
    res.end()
})

//Combinar query y params

//localhost:3001/departamentos/color?donde=Mexico&cuando=Julio&precio=2523
//localhost:3001/quintas/color?donde=Mexico&cuando=Julio&precio=2523
//localhost:3001/locales/color?donde=Mexico&cuando=Julio&precio=2523
//localhost:3001/loft/color?donde=Mexico&cuando=Julio&precio=2523
// app.get("/:tipoDeInmueble/:color", (req, res) => {
//     console.log("Los params son: ", req.params)
//     console.log("Los queries son: ", req.query)
//     res.end()
// })

app.get("/buscar", (req, res) => {
    res.render("formularioBusqueda")
})
//http://localhost:3001/mostrarDatos?usuario=holaa&fecha=2022-07-14T13%3A32&password=asd
app.get("/mostrarDatos", (req, res) => {
    console.log(req.query)
    res.send("<h1>DATOS</h1>")
})

const POKEMONES = [
    {
        name: "picachu",
        url: "https://www.buscopng.com/wp-content/uploads/2020/11/Pokemon-Pikachu.png",
        type: "Electricidad"
    },
    {
        name: "Bulbasaur",
        url: "https://www.pnguniverse.com/wp-content/uploads/2022/03/Bulbasaur-49868fe0.png",
        type: "Planta"
    },
    {
        name: "Charmander",
        url: "https://w7.pngwing.com/pngs/9/929/png-transparent-pokemon-charmander-pikachu-pokemon-x-and-y-charmander-charizard-charmander-food-orange-vertebrate.png",
        type: "Fueguito"
    },
    {
        name: "Squirtle",
        url: "https://i.pinimg.com/236x/5c/a4/67/5ca46751512f5ab01e35bd76627ff591--pokemon-pictures-joseph.jpg",
        type: "Aguita"
    }
]

//Listando todos los pokemones

app.get("/pokemones", (req, res) => {
    //Obtener todos los pokemones
    pokemonModel.find()
        .then((losPokemones) => {
            console.log(losPokemones)
            res.render("pokemones", { POKEMONES: losPokemones })
        }).catch(console.log)
})


//Viendo detalle
app.get("/pokemones/:name", (req, res) => {

    //Destructuring ES6

    const name = req.params.name

    // const detailPokemon = POKEMONES.filter(pok => {
    //     return pok.name === name
    // })

    pokemonModel.find({ name })
        .then((detallePokemon) => {
            res.render("pokemones", { POKEMONES: detallePokemon })
        })
        .catch(console.log)

})

app.get("/pokemon/filtrados", (req, res) => {
    const name = req.query.name
    console.log(name)

    const detailPokemon = POKEMONES.filter(pok => {
        return pok.name === name
    })

    res.render("pokemones", { POKEMONES: detailPokemon })
})

app.get("/nuevo-pokemon", (req, res) => {
    res.render("formularioNuevo")
})


//Creamos un nuevo pokemon Create/POST
app.post("/guardarPokemon", (req, res) => {
    console.log("GUARDAR POKEMON", req.body)
    //POKEMONES.push(req.body)
    pokemonModel.create(req.body)
        .then((pokeGuardado) => {
            console.log(pokeGuardado)
        })
        .catch(console.log)
    res.send("<h2>Guardado</h2>")
})

//Escuchar en un puerto 3001

app.listen(3001, () => {
    console.log("El servidor esta prendido en el puerto 3001")
})


//Comandos terminal

/** 
 * npm init -y        = Inicializar un proyecto de npm  el flag -y es para aceptar 
 *                      todas la opc del formulario
 * node "file.js"     = Indica al runtime de NodeJs que ejecute el archivo
 * 
 * npm i /npm install = Instala un paquete en nuestras dependencias
 * 
 * Scripts - Nos ayuda a tener un alias a un comando extenso
 * 
 * npm start = Ejecuta el script "start"
 * 
 * nodemon = Es un paquete que inicia el server y cada cambio lo reinicia
*/