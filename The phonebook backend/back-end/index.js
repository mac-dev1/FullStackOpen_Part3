require('dotenv').config()
const express = require('express')  
const cors = require('cors')
const Person = require('./models/person')
const { ObjectId } = require('mongodb')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan('tiny',{skip: (req,res) => {return req.method === 'POST'}}))

morgan.token('body',(req,res)=>{
    return JSON.stringify(res.req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body',{skip: (req,res) => {return req.method !== 'POST'}}))

// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"n
//     }
// ]

app.get('/api/persons',(request,response) =>{       
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info',(request,response) => {
    Person.find({}).then (persons => {
        const reqDate = Date()
        response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${reqDate}</p>`)
    })
})

app.get('/api/persons/:id',(request,response) => {
    Person.findById(request.params.id).then(person =>{
        response.json(person)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body    

    if (!body.name) {
        return response.status(400).json({ 
        error: 'name missing' 
        })
    }else if(!body.number){
        return response.status(400).json({
            error: 'number missing'
        })
    }

    Person.find({name: body.name}).then(person =>{
        if(person.length !== 0){
            return response.status(400).json({
                error: 'name must be unique'
            })
        }else{
            const person = new Person(
                {
                    name: body.name,
                    number: body.number
                })
                
            person.save().then(savedPerson => {
                response.json(savedPerson)
            })
        }
    })
})

app.delete('/api/persons/:id',(request,response)=>{
    Person.deleteOne(new ObjectId(request.params.id)).then( query =>{
        console.log('deleted ', query.deletedCount)
        response.status(204).end()
      }
      )    
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})