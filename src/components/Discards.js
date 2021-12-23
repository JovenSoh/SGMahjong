import {Box, Flex, Center, Wrap, WrapItem} from '@chakra-ui/react'

export default function Discards({discards}){

    const tileList = discards.map((tile, idx) =>{
        return (
            <Box fontSize={40} textShadow="3px 4px #343434" h='5vh' w='6vh'>
                {tile.picture}
            </Box> 
        )
    })

    return(
        <Wrap spacing='1px' h='50vh' w='50vh' >
                {tileList}
        </Wrap>
    )
}