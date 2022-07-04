/**
 * name: String
 * url: String
 * type: String
 */

const mongoose = require("mongoose")

const Schema = mongoose.Schema

const pokemonSchema = new Schema({
    name: String,
    url: String,
    type: String
})

const pokemonModel = mongoose.model("Pokemon", pokemonSchema)


//Nos ayuda a tener disponible el modelo en otros archivos
module.exports = pokemonModel