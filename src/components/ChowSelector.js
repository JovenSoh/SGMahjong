import {VStack, StackDivider, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton} from '@chakra-ui/react'
import TileSet from './Tileset'
import { compare } from './Mahjong';

export default function ChowSelector({sequentialTiles, isOpen, onClose, handleChow, lastDiscard}) {
  if (sequentialTiles){
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalContent w='250px' bg="rgba(255,255,255,0)">
            <ModalHeader textColor="#121212">Select a set</ModalHeader>
            <ModalBody>
              <VStack divider={<StackDivider borderColor='gray.200' />} spacing={3}>
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