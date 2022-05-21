import {Box, HStack, VStack, Center} from "@chakra-ui/react"
import Tileset from "./Tileset"
import NameCard from './NameCard'

export default function OtherPlayer({gameState, gameStateIndex, currentPlayer, playerIndex, hoveredTile}){

    const hiddenList = (gameStateIndex) => {
        let hiddenTemp = Array.apply(null, Array(gameState[gameStateIndex].handLength)).map(function () {})
        const hidden = hiddenTemp.map(() => {
            return(
                <Box h='2vh' w='3.5vh'  borderRadius="5px" borderWidth='1px' borderColor='black' bg='white' borderStyle='solid' />
            )
        })
        return(hidden)
    }

    const hiddenListV = (gameStateIndex) => {
        let hiddenTemp = Array.apply(null, Array(gameState[gameStateIndex].handLength)).map(function () {})
        const hidden = hiddenTemp.map(() => {
            return(
                <Box h='3.5vh' w='2vh' borderRadius="5px" borderWidth='1px' borderColor='black' bg='white' borderStyle='solid' />
            )
        })
        return(hidden)
    }

    if (playerIndex === 1){
        return(
            <Box>
                {gameState[(gameStateIndex+1)%4] &&
                <VStack spacing='10px'>
                    <NameCard playerID={gameState[(gameStateIndex+1)%4].playerID} username={gameState[(gameStateIndex+1)%4].username} currentPlayer={currentPlayer} wind={gameState[(gameStateIndex+1)%4].wind} />
                    <HStack>
                        <Box w='60px'>
                            <Tileset direction="vertical" tiles={gameState[(gameStateIndex+1)%4].revealedTiles.concat(gameState[(gameStateIndex+1)%4].bonusTiles)} hoveredTile={hoveredTile}/>
                        </Box>
                        <Box>
                            <VStack spacing='2px'>
                                {hiddenListV((gameStateIndex+1)%4)}
                            </VStack>
                        </Box>
                    </HStack>
                </VStack>
                }
            </Box>
        )
    }
    else if (playerIndex === 2){
        return(
            <Box>
                {gameState[(gameStateIndex+2)%4] &&
                <>
                    <NameCard playerID={gameState[(gameStateIndex+2)%4].playerID} username={gameState[(gameStateIndex+2)%4].username} currentPlayer={currentPlayer} wind={gameState[(gameStateIndex+2)%4].wind} />
                    <Box>
                        <Center>
                            <HStack spacing='2px'>
                                {hiddenList((gameStateIndex+2)%4)}
                            </HStack>
                        </Center>
                        <Center>
                            <Tileset tiles={gameState[(gameStateIndex+2)%4].revealedTiles.concat(gameState[(gameStateIndex+2)%4].bonusTiles)} hoveredTile={hoveredTile}/>
                        </Center>
                    </Box>
                </>
                }
            </Box>
        )
    }else if (playerIndex === 3){
        return(
            <Box>
                {gameState[(gameStateIndex+3)%4] &&
                    <VStack spacing='10px'>
                        <NameCard playerID={gameState[(gameStateIndex+3)%4].playerID} username={gameState[(gameStateIndex+3)%4].username} currentPlayer={currentPlayer} wind={gameState[(gameStateIndex+3)%4].wind} />
                        <HStack>
                            <Box>
                                <VStack spacing='2px'>
                                    {hiddenListV((gameStateIndex+3)%4)}
                                </VStack>
                            </Box>
                            <Box w='60px'>
                                <Tileset direction="vertical" tiles={gameState[(gameStateIndex+3)%4].revealedTiles.concat(gameState[(gameStateIndex+3)%4].bonusTiles)} hoveredTile={hoveredTile}/>
                            </Box>
                        </HStack>
                    </VStack>
                }
            </Box>
        )
    }
}