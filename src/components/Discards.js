import { Wrap } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import Tile from './Tile'

export default function Discards({discards, hoveredTile, setHoveredTile, handleHover}){

    const tileList = discards.map((tile) =>{
        return (
            <motion.div onHoverStart={() => handleHover(tile)} onHoverEnd={() => setHoveredTile(null)} whileHover={{scale:1.1}}  >
                <Tile picture={tile.picture} hoveredTile={hoveredTile} />
            </motion.div>
        )
    })

    return(
        <Wrap spacing='5px' h='50vh' w='50vh' >
                {tileList}
        </Wrap>
    )
}