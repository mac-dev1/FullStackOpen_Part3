import { useState } from "react"
import personService from '../services/phonebook'
import Notification from "./Notification"
import '../index.css'

const PersonForm = ({persons,setPersons}) =>{
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [notificationMessage, setNotificationMessage] = useState()
    const [notificationClass, setNotificationClass] = useState()

    const addPerson = (event)=>{
        event.preventDefault()
        const personObject = {
          name: newName,
          number: newNumber,
          id: `${persons.length+1}`
        }
        if(!persons.map(person => person.name).includes(personObject.name)){
            personService
                .create(personObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    setNewName('')    
                    setNewNumber('')
                    setNotificationMessage(`Added ${personObject.name}`)
                    setNotificationClass("modification")
                })
                .catch(error => alert(error))        
            }
        else{
            if(window.confirm(`${personObject.name} is already added to the phonebook,replace the old number?`)){
                personObject.id = persons.find(person => person.name === personObject.name).id
                console.log(personObject)
                personService
                    .update(personObject)
                    .then(returnedPerson => {
                        setPersons(persons.map(person => person.name === returnedPerson.name?
                        returnedPerson:person))
                        setNewName('')    
                        setNewNumber('')
                        setNotificationMessage(`${personObject.name} number updated`)
                        setNotificationClass("modification")
                    })
                    .catch(error => {
                        setNotificationMessage(`Information of ${personObject.name} has already been removed from server`)
                        setNotificationClass("error")
                        setPersons(persons.filter(person => person.id !== personObject.id))
                    })
            }
            
        }
    }

    const handleNameChange = (event)=>{
    setNewName(event.target.value)
    }
    
    const handleNumberChange = (event)=>{
    setNewNumber(event.target.value)
    }

    return(
        <>
            <Notification message={notificationMessage} notificationClass={notificationClass} />
            <form onSubmit={addPerson}>
                <div>name: <input value={newName} onChange={handleNameChange} required/> </div>
                <div>number: <input value={newNumber} onChange={handleNumberChange} required/> </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
        </>
    )
}

export default PersonForm