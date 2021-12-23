import {Button, Box, Modal, ModalOverlay, ModalContent, ModalHeader, useDisclosure, ModalBody, ModalFooter, ModalCloseButton} from '@chakra-ui/react'
import { useState } from 'react'

export default function Draw({draw, setDraw, roundEnd,setRoundEnd, handleNewGame}) {
    const { isOpen, onOpen, onClose } = useDisclosure()     
    const [newGame, setNewGame] = useState(true)
    
    if (roundEnd && draw && !isOpen){
        onOpen()
        setTimeout(() => {
            setNewGame(false)}
            ,3000)
    }

    const handleClose = () => {
        setDraw(true)
        setRoundEnd(false)
        setNewGame(true)
        onClose()
    }

    if (roundEnd){
        
        return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Nobody wins!</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    
                </ModalBody>
                <ModalFooter>
                    <Button isDisabled={newGame} onClick={handleNewGame} >New game</Button>
                </ModalFooter>
    
            </ModalContent>
            </Modal>
        </>
    )}

    return null
}