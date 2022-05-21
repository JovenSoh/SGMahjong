import {Center, Flex, Text, Image} from "@chakra-ui/react"


export default function NameCard({playerID, username, currentPlayer, wind}){
    
    return(
            <Center >
                <Flex h='3vh' textColor='#fafafa' overflow="hidden" bgColor={(currentPlayer===playerID) ? "#a36453":"#55342b"} px='5px' borderRadius="10px" borderWidth="1px" borderColor='black' borderStyle='solid'>
                    {username}
                    <Image p='2px' borderRadius="5px" src={ wind ? `https://raw.githubusercontent.com/JovenSoh/sgmahjong/gh-pages/images/${wind}.jpg` : null} fallbackSrc={wind ? `../images/${wind}.jpg` : null} w='2.3vh' h='2.8vh' />
                </Flex>
            </Center>
    )
}