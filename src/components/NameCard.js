import {Center, Flex, Text, Image} from "@chakra-ui/react"


export default function NameCard({playerID, username, currentPlayer, wind}){
    //convert tableWind to image
    let windImages = {
        "~east": "}wind1",
        "~south": "}wind2",
        "~west": "}wind3",
        "~north": "}wind4"
    }

    let windImage = windImages[wind]
    return(
            <Center >
                <Flex h='3vh' textColor='#fafafa' overflow="hidden" bgColor={(currentPlayer===playerID) ? "#a36453":"#55342b"} px='5px' borderRadius="10px" borderWidth="1px" borderColor='black' borderStyle='solid'>
                    {username}
                    <Image p='2px' borderRadius="5px" src={ windImage ? `https://raw.githubusercontent.com/JovenSoh/sgmahjong/gh-pages/images/${windImage}.jpg` : null} fallbackSrc={wind ? `../images/${windImage}.jpg` : null} w='2.3vh' h='2.8vh' />
                </Flex>
            </Center>
    )
}