import { determineTracksToAdd } from "../../components/Combiner"
test('Items from inputs are added to output', ()=>{
    expect(determineTracksToAdd([[1,2],[3,4]],[])).toStrictEqual([1,2,3,4])
})
test('Items already in output are not added', ()=>{
    expect(determineTracksToAdd([[1,2],[3,4]],[3])).toStrictEqual([1,2,4])
})
test('Items that appear in multiple inputs are not added multiple times', ()=>{
    expect(determineTracksToAdd([[1,2,3],[3,4]],[])).toStrictEqual([1,2,3,4])
})
test('Items that appear mulltiple times in the same input are not added multiple times', ()=>{
    expect(determineTracksToAdd([[1,2,2],[3,4]],[])).toStrictEqual([1,2,3,4])
})
test('One input', ()=>{
    expect(determineTracksToAdd([[1,2]],[])).toStrictEqual([1,2])
})
test('Three inputs', ()=>{
    expect(determineTracksToAdd([[1,2],[3,4],[5,6]],[])).toStrictEqual([1,2,3,4,5,6])
})