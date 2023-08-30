const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('body', function getBody (req) {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const generateId = () => {
    let id = 0
    do {
        min = Math.ceil(0);
        max = Math.floor(1000000);
        id = Math.floor(Math.random() * (max - min) + min);
    } while (persons.filter(person => person.id === id).length > 0)
    console.log(id)
    return id
}

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(!person)
        return response.status(404).end()
    else
        response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    return response.status(200).end()
})

app.post('/api/persons', (request, response) => {
    let id = generateId()
    const body = request.body
    if(!body.name || !body.number){
        return response.status(204).end(JSON.stringify({
            error: "You must append a name and a number."
        }))
    } else if (persons.filter(person => person.name === body.name)) {
        return response.status(204).end(JSON.stringify({
            error: "Name is already on the phonebook."
        }))
    } else {
        const newPerson = {
            "id": id,
            "name": body.name,
            "number": body.number
        }
        persons = persons.concat(newPerson)
        response.status(200).send(`Created new person with id ${id}`)
    }
})

app.get('/info', (request, response) => {
    const numPers = persons.length
    let today = new Date();
 
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    options.timeZone = 'UTC';
    options.timeZoneName = 'short';
 
    let dateNow = today.toDateString();
    let timeNow = today.toTimeString();
    response.send(`<p>Phonebook has info for ${numPers} people</p><p>${dateNow} ${timeNow}</p>`)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)