import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Pagination from '../components/Pokedex/Pagination'
import PokeCard from '../components/Pokedex/PokeCard'
import './pokedex.css'

const Pokedex = () => {

  const { trainer } = useSelector(state => state)

  const [pokemons, setPokemons] = useState()
  const [types, setTypes] = useState()
  const [typeSelected, setTypeSelected] = useState('All pokemons')

  const navigate = useNavigate()


  useEffect(() => {
    if (typeSelected != "All pokemons") {
      axios.get(typeSelected)
        .then(res => setPokemons(res.data.pokemon.map(e => e.pokemon)))
        .catch(err => console.log(err))
    } else {
      const URL = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=999999999'
      axios.get(URL)
        .then(res => setPokemons(res.data.results))
        .catch(err => console.log(err))
    }

  }, [typeSelected])

  useEffect(() => {
    const URL = 'https://pokeapi.co/api/v2/type'
    axios.get(URL)
      .then(res => setTypes(res.data.results))
      .catch(err => console.log(err))
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    const input = e.target.search.value.trim().toLowerCase()
    navigate(`/pokedex/${input}`)
  }

  const handleChange = e => {
    setTypeSelected(e.target.value)
    setPage(1)
  }
  const [page, setPage] = useState(1)
  const [pokePerPage, setpokePerPage] = useState(8)
  const initialPoke = (page - 1) * pokePerPage
  const finalPoke = page * pokePerPage
  const maxPage = pokemons && Math.ceil(pokemons.length / pokePerPage)

  return (
    <div>
      <h2 className='welcome'>Welcome {trainer}, here you can find your favorite
        pokemon.</h2>
      <form className='form' onSubmit={handleSubmit}>
        <input id='search' type="text" />
        <button className='button' >Search</button>
      </form>
      <div className='onChange'>
      <select className='onChange' onChange={handleChange}>
        <option className='all_pokemons' value='All pokemons'>All pokemons</option>
        {
          types?.map(type => (
            < option key={type.url} value={type.url}>{type.name}</option>
          ))
        }

      </select >
      </div>
      <div></div>
      <Pagination 
        page={page}
        maxPage={maxPage}
        setPage={setPage}
      />
      
      <div className='poke-container'>
        {
          pokemons?.slice(initialPoke, finalPoke).map(poke => (
            <PokeCard
              key={poke.url}
              url={poke.url}
            />
          ))
        }
      </div >
      
    </div>
  )
}

export default Pokedex