import {Center,Text, Box, Button} from '@chakra-ui/react'
import { useNavigate } from "react-router-dom"

export default function Menu(){
    let navigate = useNavigate()

    function gameID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + s4();
      };

    function createGame() {
        navigate(`/game/${gameID()}`)
    }

    return (
        <Center h='100vh' w='100vw'>
            <Box p="10px" borderWidth="2px" borderStyle='solid' borderColor='green' borderRadius="10px">
                <Text>Online Mahjong with your friends </Text>
                <Button onClick={createGame} w='100%' variant='outline'>Create game</Button>
            </Box>
        </Center>
    )
}