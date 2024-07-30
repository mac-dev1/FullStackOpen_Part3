

const Filter = ({filter,setFilter}) =>{    

    const handleFilterName = (event) =>{
        console.log(event.target.value)
        setFilter(event.target.value)
    }

    return(
        <div>
            filter shown with <input value={filter} onChange={handleFilterName} />
        </div>
    )
}

export default Filter