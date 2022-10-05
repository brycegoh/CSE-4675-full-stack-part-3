const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const url = `mongodb+srv://fullstack-bryce:${password}@cluster0.kiyfgok.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url).then(() => {
  const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  const Contact = mongoose.model('Contact', contactSchema)

  if (process.argv.length === 3) {
    Contact.find({}).then((result) => {
      console.log('phonebook:')
      result.forEach((contact) => {
        console.log(`${contact['name']} ${contact['number']}`)
      })
      mongoose.connection.close()
    })
  } else {
    // create and save //
    const contact = new Contact({
      name: name,
      number: number,
    })
    contact.save().then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
  }
})
