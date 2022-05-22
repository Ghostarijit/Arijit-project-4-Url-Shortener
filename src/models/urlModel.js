
const mongoose = require('mongoose');
//const ObjectId = mongoose.Schema.Types.ObjectId;
const URLSchema = new mongoose.Schema({
    urlCode:  {
        required: true,
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    longUrl:  {
        required: true,
        type: String
    },
    shortUrl: {
        required: true,
        type: String,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

// create a model from schema and export it
module.exports = mongoose.model('Url', URLSchema)

