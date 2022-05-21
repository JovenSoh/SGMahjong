import {Center,Text, Box, Button, Flex, InputGroup, Input, InputRightElement, Collapse, useDisclosure} from '@chakra-ui/react'
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import bgVid from "../videos/mahjongVid.webm"
import "../App.css"

export default function Menu(){
    let navigate = useNavigate()
    const [gameCode, setGameCode] = useState("")
    const [width, setWidth] = useState("100%")
    const { isOpen, onToggle } = useDisclosure()
    
    function toggleJoin(){
        setWidth("35%")
        onToggle()
    }

    function handleCodeChange(e) {
        setGameCode(e.target.value)
    }

    function gameID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + s4();
      };

    function createGame() {
        navigate(`/game/${gameID()}`)
    }

    function handleJoin() {
        if (gameCode.length < 10){
            alert("No room found")
        }else{
            navigate(`/game/${gameCode}`)
        }
    }

    return (
        <Center h='100vh' w='100vw' bg='rgba(90,90,90,0.3)'>
            <video autoPlay loop muted id='video'>
                <source src={bgVid} type='video/webm' />
            </video>
            <Box w='300px' p="10px" bgColor='rgba(240,240,240,0.9)' borderRadius="10px">
                <Center>
                    <Text fontSize="24px" textAlign='center'>Play <strong >Singapore Mahjong</strong> with your friends</Text>
                </Center>
                <Button onClick={createGame} w='100%' variant='outline' borderWidth="1px" borderStyle='solid' borderColor='green' borderRadius="10px">Create game</Button>

                <Flex>
                    <Collapse mt='7px' in={isOpen} direction="left" animateOpacity>
                        <Input px='2px' focusBorderColor='green' variant="flushed"  placeholder='Invite code' value={gameCode} onChange={(e) => handleCodeChange(e)} />
                    </Collapse>
                
                    <Button onClick={isOpen ? handleJoin : toggleJoin} w={width} variant='outline' _focus={{outline:"none"}} borderWidth="1px" borderStyle='solid' borderColor='green' borderRadius="10px">{isOpen ? "Join" : "Join game"} </Button>
                </Flex>
            </Box>
        </Center>
    )
}