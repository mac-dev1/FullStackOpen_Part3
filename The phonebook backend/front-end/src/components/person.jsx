

const Person = ({person,handleErase}) =>{
   

    return (
        <p>
            {person.name} {person.number}
             <button onClick={()=>handleErase(person)}>Delete</button>
        </p>
    )
}

export default Person
