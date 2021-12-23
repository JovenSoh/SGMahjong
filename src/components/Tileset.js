import {HStack, VStack, Box, Center} from '@chakra-ui/react'

export default function Tileset({tiles, direction}) {
  if (direction === "vertical"){
    return (
      <VStack spacing='0px'>
      {tiles.map((tile) => {
        return (
          <Box fontSize={40} textShadow="3px 4px #343434" h='5vh' w='6vh'>
            {tile.picture}
          </Box> 
          )
      })}
      </VStack>
    )
  }else{
    return (
      <HStack spacing='0px'>
      {tiles.map((tile) => {
        return (
          <Box fontSize={40} textShadow="3px 4px #343434" h='5vh' w='6vh'>
            {tile.picture}
          </Box> 
          )
      })}
      </HStack>
    )
  }
}
