import { Box, Button, Tag } from "grommet"
import { useState } from "react";
import { Select } from "grommet";
import axios from "axios";

function Combiner({playlists,token,getUserID}){

    const [selected1, setSelected1] = useState('');
    const [selected2, setSelected2] = useState('');
    const [selectedOutput, setselectedOutput] = useState('');

    const getPlaylistTrackURIs = async(playlistID,token,getUserID) => {
        let userID = getUserID()

        let tracks = []

        let next = null

        do{
            const {data} = await axios.get('https://api.spotify.com/v1/playlists/'+ playlistID +'/tracks', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                limit: 50
                }
            })

            tracks = tracks.concat(data.items);
            next = data.next
        } while(next!=null)

        return tracks.map(track => track.track.uri)
    }

    const combinePlaylists = async (e) => {
        e.preventDefault()

        if (selected1 === selectedOutput || selected2 === selectedOutput || selected1 === selected2){
            //error
            return
        }

        let trackURIs1 = getPlaylistTrackURIs(selected1,token,getUserID);
        let trackURIs2 = getPlaylistTrackURIs(selected2,token,getUserID);
      }

    return (
        <Box fill align="center" justify="start" pad="large" gap="medium" direction="row">
            <Select
                id="playlistSelect1"
                name="playlistSelect1"
                placeholder="Select"
                options={playlists}
                valueKey={{ key: 'id', reduce: true}}
                labelKey="name"
                onChange={({ value: nextValue }) => setSelected1(nextValue)}
            />
            <Tag value="+"/>
            <Select
                id="playlistSelect2"
                name="playlistSelect2"
                placeholder="Select"
                options={playlists}
                valueKey={{ key: 'id', reduce: true}}
                labelKey="name"
                onChange={({ value: nextValue }) => setSelected2(nextValue)}
            />
            <Tag value="=>"/>
            <Select
                id="outputPlaylist"
                name="outputPlaylist"
                placeholder="Select"
                options={playlists}
                valueKey={{ key: 'id', reduce: true}}
                labelKey="name"
                onChange={({ value: nextValue }) => setselectedOutput(nextValue)}
            />
            <Button onClick={combinePlaylists} />
        </Box>
    )
}

export default Combiner