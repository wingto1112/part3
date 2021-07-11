require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Note = require('./models/note')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token('data', (req, _res) => {
  return JSON.stringify(req.body)
})
const errorHandler = (error, _request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  const note = new Note({
    name: body.name,
    number: body.number,
  })
  note.save()
    .then(saved => {
      res.json(saved)
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Note.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(_updated => {
      res.json({ yes: 123 })
    })
    .catch(error => next(error))
})

app.get('/api/persons', (_req, res) => {
  Note.find({}).then(person => { res.json(person) })
})
app.get('/info', (_req, res) => {
  Note.count({}, (_err, result) => {
    res.end(`Phonebook has info for ${result} people\n${new Date()}`)
  })
})

app.get('/api/persons/:id', (req, res, next) => {

  Note.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})
app.delete('/api/persons/:id', (req, res) => {
  console.log(req.params.id)
  Note.findByIdAndRemove(req.params.id)
    .then(_result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})
const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown end point' })
}
app.use(unknownEndpoint)
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => { })
