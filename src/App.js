import logo from './logo.svg';
import './App.css';

import {useEffect, useState} from 'react';
import axios from 'axios';
import { Grommet, Box, Select } from 'grommet';
import Combiner from './components/Combiner';

//Variables for authentication
const CLIENT_ID = "2cca6ddc1cf34fc88d37478bf290a55d"
const REDIRECT_URI = "http://localhost:3000"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"
const SCOPE = "playlist-modify-public"



function App() {
  // Validation
  const [token, setToken] = useState("")

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }

    setToken(token)
  }, [])

  // Assure we have user ID
  const [userID, setUserID] = useState("")

  const getUserID = async () => {
    if (!userID || userID === ''){
      const {data} = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
              Authorization: `Bearer ${token}`
          },
      })

      setUserID(data.id)
      return data.id
    }
    return userID
  }

  // Logout

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  // Get user playlists
  const [playlists, setPlaylists] = useState([])
  const getUserPlaylists = async (e) => {
    e.preventDefault()
    let id = await getUserID()

    const {data} = await axios.get('https://api.spotify.com/v1/users/'+ id +'/playlists', {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
          limit: 50
        }
    })

    setPlaylists(data.items)
  }

  const [selected, setSelected] = useState('');

  return (
    <Grommet className="App">
      <header className="App-header">
        <h1>Playlist Tributaries</h1>
        
        {!token ?
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login to Spotify</a>
          : <button onClick={logout}>Logout</button>} 

        {playlists.length ===0 ?
          <button onClick={getUserPlaylists}>GET PLAYLISTS</button>
          : 
          <Combiner 
            playlists={playlists}
            token = {token}
          />
        }
      </header>
    </Grommet>
  );
}

export default App;
