import {Box, HStack, Button, Spacer} from '@chakra-ui/react'
import { compare } from './Mahjong'
import Tileset from './Tileset'

export default function Actions({lastDiscard, sequentialTiles, pongTiles, kongTiles, game, handleChow, handlePong, handleKong, handleGame}){
    
    const chowAction = sequentialTiles.map((e) => {
        return(
            <Box p="5px" bg='#55342b' _hover={{bg:"#a36453"}} borderRadius="5px" borderWidth="1px" borderColor="#343434" borderStyle="solid" boxShadow={`3px 4px #000000`}
                onClick={() => {
                console.log("Selected chow set", e)
                handleChow(e.concat(lastDiscard).sort(compare))
                }}>
                <Tileset tiles={e.concat(lastDiscard).sort(compare)} />
            </Box>
        )
    })

    const pongAction = pongTiles.map((e) => {
        return(
            <Box p="5px" bg='#55342b' _hover={{bg:"#a36453"}} borderRadius="5px" borderWidth="1px" borderColor="#343434" borderStyle="solid" boxShadow={`3px 4px #000000`}
                onClick={() => {
                console.log("Selected pong set", e)
                handlePong(e.sort(compare))
                }}>
                <Tileset tiles={e.sort(compare)} />
            </Box>
        )
    })

    const kongAction = kongTiles.map((e) => {
        //if it's a full kongset with type
            if (e.length > 1){
                let type = e[4]
                e = e.slice(0,4)
                return(
                    <Box p="5px" bg='#55342b' _hover={{bg:"#a36453"}} borderRadius="5px" borderWidth="1px" borderColor="#343434" borderStyle="solid" boxShadow={`3px 4px #000000`}
                    onClick={() => {
                    console.log("Selected kong set", e)
                    handleKong(e.sort(compare), type)
                    }}>
                        <Tileset tiles={e.sort(compare)} />
                    </Box>    
                )
            }
    })

    const gameAction = () => {
        return(
            <Button w='100px' h='50px' textColor="white" p='0' fontSize="18" variant='ghost' bg='#55342b' _hover={{bg:"#a36453"}}  onClick={handleGame} display={game ? "block" : "none"} >
                Mahjong
            </Button>
        )
    }

    return(
        <HStack h='100px'>
            {(sequentialTiles.length > 0) ? chowAction : null}
            {(pongTiles.length > 0) ? pongAction : null}
            {(kongTiles.length > 0) ? kongAction : null}
            {game ? gameAction() : null}
        </HStack>
    )
}