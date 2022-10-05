require('dotenv').config()
const Contact = require('./models/contact')
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')

/*

  init vars

*/
const PORT = process.env.PORT || 3001

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

/*

  LOGGING middleware

*/
app.use(
  morgan('tiny', {
    skip: (req) => req.method === 'POST',
  })
)

morgan.token('req-body', (req) => JSON.stringify(req.body))

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :req-body',
    {
      skip: (req) => req.method !== 'POST',
    }
  )
)

app.get('/api/persons', (req, res, next) => {
  Contact.find({})
    .then((results) => {
      return res.status(200).json(results).send()
    })
    .catch((err) => next(err))
})

app.get('/api/persons/:idString', (req, res, next) => {
  let { idString = null } = req.params
  if (idString !== null) {
    Contact.findById(idString)
      .then((result) => {
        if (!result) {
          return res.status(404).json({
            success: false,
            error: 'id does not exist',
          })
        }
        return res.status(200).json(result).send()
      })
      .catch((err) => next(err))
  }
})

app.get('/info', (req, res, next) => {
  const timestamp = new Date()

  Contact.countDocuments({})
    .then((count) => {
      return res
        .status(200)
        .send(
          `Phonebook has info for ${count} people <br/> ${timestamp.toString()}`
        )
    })
    .catch((err) => {
      next(err)
    })
})

app.delete('/api/persons/:idString', (req, res, next) => {
  let { idString = null } = req.params
  if (idString !== null) {
    Contact.findByIdAndRemove(idString)
      .then(() => {
        return res
          .status(200)
          .json({
            success: true,
          })
          .send()
      })
      .catch((err) => {
        next(err)
      })
  }
})

app.put('/api/persons/:idString', (req, res, next) => {
  const entry = req.body
  if ('name' in entry && 'number' in entry) {
    Contact.findOneAndUpdate(
      { name: entry['name'] },
      { number: entry['number'] },
      { upsert: true, runValidators: true }
    )
      .then(() => {
        return res.status(200).json({
          success: true,
        })
      })
      .catch((err) => next(err))
  } else {
    return res.status(404).json({
      success: false,
      error: 'Phonebook entry requires name and number',
    })
  }
})

app.post('/api/persons', (req, res, next) => {
  const entry = req.body
  if ('name' in entry && 'number' in entry) {
    Contact.find({ name: entry['name'] }).then((result) => {
      if (!result || result.length > 0) {
        return res
          .status(404)
          .json({
            success: false,
            error: 'Name exists in phonebook',
          })
          .end()
      } else {
        let newEntry = Contact({
          name: entry['name'],
          number: entry['number'],
        })
        newEntry
          .save()
          .then(() => {
            return res.status(200).json({
              success: true,
            })
          })
          .catch((err) => {
            next(err)
          })
      }
    })
  } else {
    return res.status(404).json({
      success: false,
      error: 'Phonebook entry requires name and number',
    })
  }
})

const errorHandler = (error, req, res) => {
  console.log('hello')
  return res
    .status(404)
    .json({
      success: false,
      error: error.message,
    })
    .end()
}

// handler of requests with result to errors
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Phonebook app listening on port ${PORT}`)
})
