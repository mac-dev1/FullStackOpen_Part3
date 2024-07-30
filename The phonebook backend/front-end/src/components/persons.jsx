import Person from "./person"

const Persons = ({persons,filter,handleErase}) =>{
    
    return(
    <>
        {persons.map(person => filter === '' ||
         person.name.toLowerCase().includes(filter.toLowerCase())
         ?<Person key={person.id} person={person} handleErase={handleErase} /> : [])}   
    </>
    )
}

export default Persons