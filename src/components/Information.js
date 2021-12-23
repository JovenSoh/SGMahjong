import {Tabs, TabList, TabPanels, Tab, TabPanel, VStack, Spacer, Button, Text, Heading, Flex, Box} from '@chakra-ui/react'

export default function Information({tableWind,yourWind, currentPlayer, gameState, handleNewGame, roundEnd}){
    const score = gameState.map((player) => {
        return(
            <Flex w='100%' >
                {player.username}
                <Spacer />
                {player.score}
            </Flex>
        )
    })
    
    return(
        <Tabs w='200px' mr='10px' align='center' variant='enclosed' isFitted>
            <TabList>
                <Tab>Table</Tab>
                <Tab>Scoring</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <VStack spacing='25px'>
                        <Box mt='5px'>
                            <Flex w='190px'>Prevailing Wind <Spacer /> {tableWind}</Flex>
                            <Flex w='190px'>Your Wind <Spacer /> {yourWind}</Flex>
                        </Box>
                        <Box>
                            <Heading fontSize={20} mb='5px'>Leaderboard</Heading>
                            <Box w='190px'>
                                {score}
                            </Box>
                        </Box>
                        <Flex w='190px'>
                            <Spacer />
                            <Button disabled={!roundEnd} onClick={handleNewGame} variant='outline'>New game</Button>
                        </Flex>
                        <Button onClick={handleNewGame} variant='outline'>New game (Debug)</Button>
                    </VStack>

                </TabPanel>
                <TabPanel>
                    
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}
