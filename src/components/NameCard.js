import {Center, Text} from "@chakra-ui/react"


export default function NameCard({playerID, currentPlayer}){

    return(
            <Center >
                <Text h='3vh' overflow="hidden" bg={(currentPlayer===playerID) ? "#f1f1f1":null} px='5px' borderRadius="10px" borderWidth="1px" borderColor='black' borderStyle='solid'>
                    {playerID}
                </Text>
            </Center>
    )
}