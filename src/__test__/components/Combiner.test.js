import { determineTracksToAdd } from "../../components/Combiner"
test('dummy test', ()=>{
    expect(determineTracksToAdd([],[])).toStrictEqual([])
})