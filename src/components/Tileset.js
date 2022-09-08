import {HStack, VStack, Box, Image} from '@chakra-ui/react'
import Tile from './Tile'

export default function Tileset({tiles, direction, hoveredTile}) {
  if (direction === "vertical"){
    let spacing = 0
    if (tiles.length > 10){
      spacing = 0.14*tiles.length
    }
    return (
      <VStack spacing={`-${spacing}vh`}>
      {tiles.map((tile) => {
        return (
          <Tile picture={tile.picture} hoveredTile={hoveredTile} />
          )
      })}
      </VStack>
    )
  }else{
    return (
      <HStack spacing='1px'>
      {tiles.map((tile) => {
        if (tile){
          return (
            <Tile picture={tile.picture} hoveredTile={hoveredTile} />
            )
        }
      })}
      </HStack>
    )
  }
}
