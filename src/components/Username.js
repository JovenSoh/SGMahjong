import {useState} from 'react'
import {Flex, Spacer, FormControl, Button, Input, Modal, ModalOverlay, ModalHeader,ModalBody, ModalContent, useDisclosure} from "@chakra-ui/react"

export default function Username({sendMessage}) {
    const {isOpen, onOpen, onClose } = useDisclosure({defaultIsOpen:true})
    const [username, setUsername] = useState('')

    const onUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    //Set Username
    const submitUsername = () => {
        onClose()
        sendMessage("Username: "+username)
    }
    
    return(
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Username</ModalHeader>
                <FormControl px='20px'>
                    <Input onKeyPress={(e) => { (e.key==="Enter") ? submitUsername() : console.log() }} onChange={onUsernameChange} value={username} placeholder="Username" />
                    <Flex>
                        <Spacer />
                        <Button my='10px' onClick={submitUsername} type='submit'>Submit</Button>
                    </Flex>
                </FormControl>
            </ModalContent>
        </Modal>
    )
}