import {Box, HStack, Center, Spacer, Button, VStack} from '@chakra-ui/react'
import Tileset from './Tileset'
import OtherPlayer from './OtherPlayer'
import Discards from './Discards'
import Unselect from './Unselect'
import { motion } from "framer-motion"

export default function Board({clientID, tiles, newTile, handleSelectTile,currentTurn, currentPlayer, gameState, discards, selectedTile, handleDiscard, pong, handlePong, chow, handleChow, multiChow, handleMultiChow, game, handleGame}){
    let gameStateIndex = gameState.findIndex(e => e.playerID === clientID)
    
    
    const tileVariants = {
        selected: {y:-15},
        unselected: {y:0}
    }

    const handleClickTile = (tile) => {
        if (selectedTile === tile && currentTurn){
            handleDiscard()
        }else{
            handleSelectTile(tile)
        }
    }

    //Render tiles
    const tileList = tiles.map((tile, idx) =>{
        var color = "#343434"
        if (tile === newTile && currentTurn){
            color = "#ff4a4a"
        }

        return (
            
                <motion.div whileHover={{scale:1.1}} variants={tileVariants} animate={(selectedTile === tile) ? 'selected':'unselected'} >
                    <Box fontSize={40} textShadow={`3px 4px ${color}`} key={idx} value = {tile} onClick={() => handleClickTile(tile)} >
                        {tile.picture}
                    </Box>
                </motion.div>
        )

    })


    return(
        <>
        <VStack h='95vh' w='95vh' m='auto' mt='2vh' borderWidth='1px' borderColor='black' borderStyle='solid'>
            <OtherPlayer gameState={gameState} gameStateIndex={gameStateIndex} currentPlayer={currentPlayer} playerIndex={2} />
            <Spacer />
            <HStack w='100%'>
                <OtherPlayer gameState={gameState} gameStateIndex={gameStateIndex} currentPlayer={currentPlayer} playerIndex={3} />
                <Spacer />
                <Discards discards={discards} />
                <Spacer />
                <OtherPlayer gameState={gameState} gameStateIndex={gameStateIndex} currentPlayer={currentPlayer} playerIndex={1} />
            </HStack>
            <Spacer />
            <HStack>
                <Button variant="ghost" isDisabled={!pong} onClick={handlePong}> 碰 </Button> 
                <Button variant="ghost" isDisabled={!chow} onClick={ multiChow? handleMultiChow : handleChow}> 吃 </Button>
                <Button variant="ghost" isDisabled={!game} onClick={handleGame}> 胡 </Button> 
            </HStack>
            <Spacer />
            { gameState[gameStateIndex] &&
            <Box position='relative' zIndex={2}>
                <Box w='100%' m='auto'>
                    <Center mb='5px'>
                        <Tileset tiles={gameState[gameStateIndex].revealedTiles.concat(gameState[gameStateIndex].bonusTiles)} />
                    </Center>
                </Box>
                <Box w='100%' m='auto'>
                    <Center>
                        <Unselect handleSelectTile={handleSelectTile}>
                            <HStack spacing="0px">
                                {tileList}
                            </HStack>
                        </Unselect>
                    </Center>
                </Box>
            </Box>
            }
        </VStack>
        </>
    )
}