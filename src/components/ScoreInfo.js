import { Collapse, Box, Flex, Spacer, HStack, Image, Text, useDisclosure } from "@chakra-ui/react"
import Tile from "./Tile"

export default function ScoreInfo({name, score, info, pictures}) {
    const { isOpen, onToggle } = useDisclosure()

    const combination = pictures.map((picture) => {
        if (picture === ""){
            return(
                <Box w='10px' />
            )
        }else{
            return(
                <Image src={`https://raw.githubusercontent.com/JovenSoh/sgmahjong/gh-pages/images/${picture}.jpg`} fallbackSrc=""  h="26px" borderRadius="5px" borderWidth="1px" borderColor="#343434" borderStyle="solid" boxShadow={`1.2px 2px #000000`} />
            )
        }
    })

    return(
        <Box>
            <Flex>
                <Box _hover={{"text-decoration": "underline"}} onClick={onToggle}>{name}</Box>
                <Spacer />
                {score}
            </Flex>
            <Collapse in={isOpen}>
                {info.split(".").map((sentence) => {
                    return(
                        <Text align='left' justifyContent fontSize={12}>
                            {sentence}
                        </Text>
                    )
                    })}
                <HStack spacing='0px'>
                    {combination}
                </HStack>
            </Collapse>
        </Box>
    )
}