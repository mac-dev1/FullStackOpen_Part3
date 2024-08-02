const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('Give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://mauriciocasarottodev:${password}@cluster0.cv26dav.mongodb.net/thePhonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)


const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length<4){
    Person.find({}).then(result =>{
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}else{
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    person.save().then(contact => {
        console.log('Added ',contact.name,' number ', contact.number,' to phonebook')
        mongoose.connection.close()
    })
}
