import { Box } from "grommet"
import { useState } from "react";
import { Select } from "grommet";

function Combiner({playlists}){

    const [selected, setSelected] = useState('');

    return (
        <Box fill align="center" justify="start" pad="large" gap="medium">
            <Select
                id="playlistSelect"
                name="playlistSelect"
                placeholder="Select"
                options={playlists}
                valueKey={{ key: 'id', reduce: true}}
                labelKey="name"
                onChange={({ value: nextValue }) => setSelected(nextValue)}
            />
        </Box>
    )
}

export default Combiner