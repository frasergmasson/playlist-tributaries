import { Box, Button, Tag } from "grommet"
import { useState } from "react";
import { Select } from "grommet";

function Combiner({playlists}){

    const [selected1, setSelected1] = useState('');
    const [selected2, setSelected2] = useState('');
    const [selectedOutput, setselectedOutput] = useState('');

    const combinePlaylists = async (e) => {
        e.preventDefault()

        if (selected1 === selectedOutput || selected2 === selectedOutput || selected1 === selected2){
            //error
            return
        }
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