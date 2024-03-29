import { Box, Button, Tag, Notification} from "grommet"
import { useState } from "react";
import { Select } from "grommet";
import axios from "axios";

//Works out what tracks need to be added to the output playlist, avoiding duplicates in the output
function determineTracksToAdd(inputPlaylists,outputPlaylist){
    //Combine input playlists and remove duplicates using Set
    let allItems = inputPlaylists.reduce((l1,l2) => l1.concat(l2),[])
    allItems = [...new Set(allItems)];
    //Remove items that already exist in the output playlist
    return allItems.filter(item => !outputPlaylist.includes(item))
}

function Combiner({playlists,token}){

    const [selected1, setSelected1] = useState('');
    const [selected2, setSelected2] = useState('');
    const [selectedOutput, setselectedOutput] = useState('');

    const [combineStatus,setCombineStatus] = useState('');
    //State enums
    const SUCCESS = "SUCCESS"
    const FAILURE = "FAILURE"

    const getPlaylistTrackURIs = async(playlistID,token) => {
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

    const splitArray = (a, size) =>
        Array.from(
            new Array(Math.ceil(a.length / size)),
            (_, i) => a.slice(i * size, i * size + size)
    );

    const addTracksToPlaylist = async(trackURIs,playlistID,token) => {
        // Maximum 100 tracks can be added per call so uris may have to be split
        const uriSets = splitArray(trackURIs,100)

        uriSets.forEach( async set => {
            //Call to add uris
            const {data} = await axios.post('https://api.spotify.com/v1/playlists/'+ playlistID +'/tracks', {
                uris: set
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    
                }
            })
        })
    }

    const combinePlaylists = async (e) => {
        e.preventDefault()

        if (selected1 === selectedOutput || selected2 === selectedOutput || selected1 === selected2){
            //error
            return
        }

        let trackURIs1 = getPlaylistTrackURIs(selected1,token);
        let trackURIs2 = getPlaylistTrackURIs(selected2,token);
        let outputURIs = getPlaylistTrackURIs(selectedOutput,token);

        let allURIs = determineTracksToAdd([await trackURIs1,await trackURIs2],await outputURIs) 

        addTracksToPlaylist(allURIs,selectedOutput,token)
        setCombineStatus(SUCCESS)
      }

      const displayMessage = (status) => {
        if (status === SUCCESS){
            return <Notification
                message="Tracks added to playlist successfully!"
                status="normal"
            />
        }
        if (status === FAILURE){
            return <Notification
                message="Failed to add tracks to playlist."
                status="critical"
            />
        }
        return
      }

    return (
        <Box fill align="center" justify="start" pad="large" gap="medium" direction="column">
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
                <Button onClick={combinePlaylists} label="Combine" />
            </Box>

            <Box fill align="center" justify="start" pad="large" gap="medium" direction="row">
                {displayMessage(combineStatus)}
            </Box>
        </Box>
    )
}

export {determineTracksToAdd}
export default Combiner