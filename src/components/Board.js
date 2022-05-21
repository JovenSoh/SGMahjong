import {Box, HStack, Center, Spacer, Button, VStack, Image} from '@chakra-ui/react'
import { useState } from 'react'
import Tileset from './Tileset'
import OtherPlayer from './OtherPlayer'
import Discards from './Discards'
import Unselect from './Unselect'
import Tile from './Tile'
import { motion } from "framer-motion"
import Actions from './Actions'

export default function Board({clientID, tiles, newTile, handleSelectTile,currentTurn, currentPlayer, gameState, discards, selectedTile, handleDiscard, lastDiscard, pongTiles, handlePong, sequentialTiles, handleChow, kongTiles, handleKong, game, handleGame}){
    const [hoveredTile, setHoveredTile] = useState()
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

    const handleHover = (tile) => {
        setHoveredTile(tile)
    }

    //Render tiles
    const tileList = tiles.map((tile, idx) =>{
        var color = "#343434"
        if (tile === newTile && currentTurn){
            color = "#ff4a4a"
        }

        return (
                <motion.div onHoverStart={() => handleHover(tile)} onHoverEnd={() => setHoveredTile(null)} whileHover={{scale:1.1}} variants={tileVariants} animate={(selectedTile === tile) ? 'selected':'unselected'} >
                    <Box key={idx} value = {tile} onClick={() => handleClickTile(tile)} >
                        <Tile picture={tile.picture} color={color} />
                    </Box>
                </motion.div>
        )

    })


    return(
        <>
        <VStack h='95vh' w='95vh' m='auto' mt='2vh' bgColor="#006442" borderWidth='5px' borderColor='#55342b'  borderStyle='solid'>
            { gameState[(gameStateIndex+2)%4]? <OtherPlayer gameState={gameState} gameStateIndex={gameStateIndex} currentPlayer={currentPlayer} playerIndex={2} hoveredTile={hoveredTile}/> : <Spacer /> }
            <Spacer />
            <HStack w='100%'>
                { gameState[(gameStateIndex+3)%4]? <OtherPlayer gameState={gameState} gameStateIndex={gameStateIndex} currentPlayer={currentPlayer} playerIndex={3} hoveredTile={hoveredTile}/> : <Spacer /> }
                <Spacer />
                <Discards discards={discards} hoveredTile={hoveredTile} setHoveredTile={setHoveredTile} handleHover={handleHover} />
                <Spacer />
                { gameState[(gameStateIndex+1)%4]? <OtherPlayer gameState={gameState} gameStateIndex={gameStateIndex} currentPlayer={currentPlayer} playerIndex={1} hoveredTile={hoveredTile}/> : <Spacer /> }
            </HStack>
            <Spacer />
            {(sequentialTiles.length === 0 && pongTiles.length === 0 && kongTiles.reduce((count, row) => count + row.length, 0) <= 1 && !game) ? <Box h='100px' /> : <Actions lastDiscard={lastDiscard} sequentialTiles={sequentialTiles} pongTiles={pongTiles} kongTiles={kongTiles} game={game} handleChow={handleChow} handlePong={handlePong} handleKong={handleKong} handleGame={handleGame} /> }
            { gameState[gameStateIndex] &&
            <Box position='relative' zIndex={2}>
                <Box w='100%' m='auto'>
                    <Center mb='5px'>
                        <Tileset tiles={gameState[gameStateIndex].revealedTiles.concat(gameState[gameStateIndex].bonusTiles)} />
                    </Center>
                </Box>
                <Center w='100%' m='auto' mb='5px'>
                    <Unselect handleSelectTile={handleSelectTile}>
                        <HStack spacing="1px">
                            {tileList}
                        </HStack>
                    </Unselect>
                </Center>
            </Box>
            }
        </VStack>
        </>
    )
}