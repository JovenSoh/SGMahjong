import {Button, Box, Modal, ModalOverlay, ModalContent, ModalHeader, useDisclosure, ModalBody, ModalFooter, ModalCloseButton} from '@chakra-ui/react'
import { useState } from 'react'

export default function Summary({winnerID, roundEnd, setRoundEnd, summary, handleNewGame, draw}) {
    const { isOpen, onOpen, onClose } = useDisclosure()     
    const [newGame, setNewGame] = useState(true)
    
    if (roundEnd && !isOpen){
        onOpen()
        setTimeout(() => {
            setNewGame(false)}
            ,3000)
    }

    const handleClose = () => {
        setRoundEnd(false)
        setNewGame(true)
        onClose()
    }

    if (roundEnd && !draw){
        
        return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{winnerID} wins!</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Animal: {summary.animalPoints} <p />
                    Seat flower: {summary.windPoints} <p />
                    Dragon: {summary.dragonPoints} <p />
                    Prevailing wind: {summary.tableWindPoints} <p />
                    Seat wind: {summary.yourWindPoints} <p />
                    Mahjong Points: {summary.combinationPoints} <p />
                    Total Points: {summary.totalPoints} <p />
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