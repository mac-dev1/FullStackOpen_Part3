const express = require('express')  
const cors = require('cors')
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

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request,response) =>{       
    response.json(persons)
})

app.get('/info',(request,response) => {
    const numPeople = persons.length
    const reqDate = Date()

    response.send(`<p>Phonebook has info for ${numPeople} people</p><p>${reqDate}</p>`)
    
})

app.get('/api/persons/:id',(request,response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if(person){
        response.json(person)
    }else{
        response.status(404).send()
    }

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
    }else if(persons.find(person => person.name === body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: String(Math.round(Math.random()*1000)+1),
        name: body.name,
        number: String(body.number)
    }

    persons = persons.concat(person)

    response.json(person)
})


app.delete('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).send()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})