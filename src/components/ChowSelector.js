import {VStack, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton} from '@chakra-ui/react'
import TileSet from './Tileset'
import { compare } from './Mahjong';

export default function ChowSelector({sequentialTiles, isOpen, onClose, handleChow, lastDiscard}) {
  if (sequentialTiles){
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Select a set</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={3}>
                  {sequentialTiles.map((e) => {
                    return(
                      <Box onClick={() => {
                        console.log("Selected chow set", e)
                        handleChow(e)
                        }}>
                        <TileSet tiles={e.concat(lastDiscard).sort(compare)} />
                      </Box>
                    )
                  })}
              </VStack>
            </ModalBody>
  
          </ModalContent>
        </Modal>
      </>
  )}
  return null
}