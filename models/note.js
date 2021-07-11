const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected')
  })
  .catch((error) => {
    console.log('error', error.message)
  })
const noteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,unique: true, minLength: 3
  },
  number: {
    type: String,
    required: true, minLength: 8
  }
})
noteSchema.plugin(uniqueValidator)
noteSchema.set('toJSON',{
  transform: (doc, returnObj) => {
    returnObj.id = returnObj._id.toString()
    delete returnObj._id
    delete returnObj.__v
  } 
})
module.exports = mongoose.model('Note', noteSchema)