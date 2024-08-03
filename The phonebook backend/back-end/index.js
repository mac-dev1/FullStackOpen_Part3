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

app.get('/api/persons/:id',(request,response,next) => {
    Person.findById(request.params.id)
    .then(person =>{
        if(person){
            response.json(person)
        }else{
            response.status(400).end()
        }
    })
    .catch(error => next(error))
})

const updateIfExists = (request, response, next) => {
    const body = request.body
    
    const person = {
        name: body.name,
        number: body.number
    }
    
    Person.findByIdAndUpdate(request.params.id,person,{new: true})
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
}


app.post('/api/persons', (request, response, next) => {
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
    
    Person.findOne({name:body.name})
    .then(oldPerson => {
        if(oldPerson){
            updateIfExists(
                {...request,
                    params:{
                            ...request.params,
                            id:oldPerson._id
                        }
                },response,next)
        }else{
            const newPerson = new Person({
                name:body.name,
                number: body.number
            })
            newPerson.save()
                .then(savedPerson => response.json(savedPerson))
        }
    })
        
})


app.put('/api/persons/:id', (request,response,next) => updateIfExists(request,response,next))

app.delete('/api/persons/:id',(request,response,next)=>{
    Person.findByIdAndDelete(request.params.id)
        .then(result =>{
            response.status(204).end()
        })
        .catch(error => {next(error)})
})

const unknownEndpoint = (request,response) =>{
    response.status(204).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})