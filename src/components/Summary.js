import {Button, Box, Center, Table, Thead, Tbody, Th, Tr, Td, Modal, ModalOverlay, ModalContent, ModalHeader, useDisclosure, ModalBody, ModalFooter, ModalCloseButton} from '@chakra-ui/react'
import { useState, useEffect } from 'react'

export default function Summary({username, roundEnd, summary, handleNewGame, draw, isOpen, onOpen, onClose}) {  
    const [newGame, setNewGame] = useState(true)
    
    useEffect(() => {
        if (roundEnd){
        onOpen()
        setTimeout(() => {
            setNewGame(false)}
            ,3000)
        }
    },[roundEnd])

    const nameDict = {
        animalPoints: "Animal Tiles",
        dragonPoints: "Dragon Set",
        flowerPoints: "Seat Flower",
        tableWindPoints: "Prevailing Wind Set",
        yourWindPoints: "Seat Wind Set",
        totalPoints: "Total tai",
        allPong: "All Pong",
        臭平和: "All Chow",
        平和: "Ping Wu",
        清一色: "Full Color",
        混一色: "Half Color",
        oneNine: "All Terminals",
        halfOneNine: "Terminals and Honors",
        七对子: "7 Pairs",
        十三幺: "13 Wonders"
    }
    //When there is a summary
    if (roundEnd){
        let summary_filtered = []
        //filter out to only those with points
        summary = Object.keys(summary).forEach(key => {
            //if value (point) is greater than 0
            if (summary[key] > 0){
                summary_filtered = summary_filtered.concat({
                                        name: nameDict[key],
                                        points: summary[key]
                                    })
            }
        })

        const table = summary_filtered.map(e => {
            return (
                <Tr>
                    <Td>{e.name}</Td>
                    <Td isNumeric>{e.points}</Td>
                </Tr>
            )
        })

        console.log("Summary filtered", summary_filtered)
        
        if (!draw){
            return (
                <>
                    <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader h='10px'>
                            <Center>
                                {username.username} wins!
                            </Center>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody >
                            <Table variant="striped" size='sm'>
                                <Thead>
                                    <Tr>
                                        <Th>Name</Th>
                                        <Th isNumeric>Double</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {table}
                                </Tbody>
                            </Table>
                        </ModalBody>
                        <ModalFooter>
                            <Button size='sm' isDisabled={newGame} onClick={handleNewGame} >New game</Button>
                        </ModalFooter>
                    </ModalContent>
                    </Modal>
                </>
            )
        }else{
            return(
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Draw</ModalHeader>
                        <ModalCloseButton />
                        <ModalFooter>
                            <Button isDisabled={newGame} onClick={handleNewGame} >New game</Button>
                        </ModalFooter>
                    </ModalContent>
                    </Modal>
            )
        }
    }

    return null
}