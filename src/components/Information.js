import {Tabs, TabList, TabPanels, Tab, TabPanel, useClipboard, Input, InputGroup, InputRightElement, Text, VStack, Spacer, Button, ButtonGroup, Image, Heading, Flex, Box} from '@chakra-ui/react'
import { CopyIcon, CheckIcon } from "@chakra-ui/icons"
import NameCard from './NameCard'
import ScoreInfo from './ScoreInfo'

export default function Information({tableWind,yourWind, playerID, currentPlayer, gameState, handleNewGame, roundEnd, onOpen, addBot, connectionStatus}){
    //Invite link
    const {hasCopied, onCopy} = useClipboard(window.location.href)
    
    const score = gameState.map((player) => {
        return(
            <Flex w='100%' >
                {player.username}
                <Spacer />
                {player.score}
            </Flex>
        )
    })
    const flowerIndex = {
        "~east": 1,
        "~south": 2,
        "~west": 3,
        "~north": 4
    }
    const scoreList = [
        {
            name: "Prevailing wind set",
            score: 1,
            info: "Pong or kong of prevailing wind",
            pictures: tableWind ? [tableWind,tableWind,tableWind] : ["~east","~east","~east"]
        },
        {
            name: "Seat wind set",
            score: 1,
            info: "Pong or kong of seat wind",
            pictures: yourWind ? [yourWind,yourWind,yourWind] : ["~east","~east","~east"]
        },
        {
            name: "Dragon tiles set",
            score: 1,
            info: "Pong or kong of any dragon tiles",
            pictures: ["~red","~red","~red"]
        },
        {
            name: "All Chow",
            score: 1,
            info: "Four sets of sequentials with an eye. Eye must not be prevailing or seat wind or dragon tile. Unless self-drawn, must have a two-sided wait",
            pictures: ["bamboo1","bamboo2","bamboo3","circles1","circles2","circles3","numbers5","numbers5"]
        },
        {
            name: "Seat flower",
            score: 1,
            info: "Flower corresponding to your seat position",
            pictures: yourWind ? ["flowers"+flowerIndex[yourWind],"flowers"+(flowerIndex[yourWind]+4)] : ["flowers1","flowers5"]
        },
        {
            name: "Animal tile",
            score: 1,
            info: "Any animal tile",
            pictures: ["cat","mouse","rooster","centipede"]
        },
        {
            name: "All Pong",
            score: 2,
            info: "Four sets of pong or kong with an eye",
            pictures: ["bamboo2","bamboo2","bamboo2","numbers6","numbers6","numbers6","~white","~white"]
        },
        {
            name: "Mixed suit",
            score: 2,
            info: "Mahjong with one suit and honors",
            pictures: ["~east","~east","~east","bamboo9","bamboo9","bamboo9","~red","~red"]
        },
        {
            name: "Terminals and Honors",
            score: 2,
            info: "Mahjong with 1s, 9s, and honors",
            pictures: ["circles1","circles1","circles1","numbers9","numbers9","numbers9","~north","~north"]
        },
        {
            name: "7 Pairs",
            score: 3,
            info: "7 eyes",
            pictures: ["~east","~east","~west","~west","~green","~green","circles5","circles5"]
        },
        {
            name: "Ping Wu",
            score: 4,
            info: "All chow without flower or animal tiles",
            pictures: ["bamboo4","bamboo5","bamboo6","circles4","circles5","circles6","numbers7","numbers7"]
        },
        {
            name: "Full Color",
            score: 4,
            info: "Mahjong with only one suit",
            pictures: ["numbers1","numbers2","numbers3","numbers8","numbers8","numbers8","numbers9","numbers9"]
        },
        {
            name: "13 Wonders",
            score: 5,
            info: "Each terminal and honors. Any eye",
            pictures: ["bamboo1","bamboo9","~east","~south","~west","~north","~red","~red"]
        },
        {
            name: "All Terminals",
            score: 5,
            info: "Mahjong with only 1s and 9s",
            pictures: ["numbers1","numbers1","numbers1","circles1","circles1","circles1","bamboo9","bamboo9"]
        },
    ]

    const scoreTable = scoreList.map((e) => {
        return(
            <ScoreInfo name={e.name} score={e.score} info={e.info} pictures={e.pictures} />
        )
    })

    const pettyList = [
        {
            name: "Predator Prey",
            score: 1,
            info: "Cat-mouse rooster-centipede pair",
            pictures: ["cat","mouse","","rooster","centipede"]
        },
        {
            name: "Flower Pair",
            score: 1,
            info: "Own an opponent flower pair",
            pictures: ["flowers"+((flowerIndex[yourWind]+1)%8),"flowers"+((flowerIndex[yourWind]+5)%8)]
        },
        {
            name: "Flower Pair (Seat)",
            score: 1,
            info: "Own your seat flower pair",
            pictures: ["flowers"+flowerIndex[yourWind],"flowers"+flowerIndex[yourWind]]
        },
        {
            name: "Concealed Kong",
            score: 2,
            info: "Perform a one/three tiles concealed kong",
            pictures: ['bamboo8','bamboo8','bamboo8','bamboo8']
        },
        {
            name: "Flowers Set (u/c)",
            score: 4,
            info: "Own all red or black flowers",
            pictures: ["flowers1","flowers2","flowers3","flowers4","flowers5","flowers6","flowers7","flowers8"]
        },
        {
            name: "Animals Set (u/c)",
            score: 4,
            info: "Own all animal tiles",
            pictures: ["cat","mouse","rooster","centipede"]
        },
    ]

    const pettyTable = pettyList.map((e) => {
        return(
            <ScoreInfo name={e.name} score={e.score} info={e.info} pictures={e.pictures} />
        )
    })

    let username
    if (gameState.find(e => e.playerID === playerID)){
        username = gameState.find(e => e.playerID === playerID).username
        console.log("USERNAME: ", username)
    }

    return(
        <Box w='200px' h='100vh' bg='white'>
            <Tabs mr='10px' align='center' variant='enclosed' isFitted>
                <TabList>
                    <Tab>Table</Tab>
                    <Tab>Scoring</Tab>
                </TabList>

                <TabPanels >
                    <TabPanel w='200px'>
                        <VStack spacing='25px'>
                            <Box mt='5px'>
                                <NameCard playerID={playerID} username={username} currentPlayer={currentPlayer} wind={yourWind}/>
                                <Flex w='190px'>Prevailing Wind <Spacer /> <Image src={`https://raw.githubusercontent.com/JovenSoh/sgmahjong/gh-pages/images/${tableWind}.jpg`} fallbackSrc={`/images/${tableWind}.jpg`} h='30px' borderRadius="5px" /> </Flex>
                            </Box>
                            <Box>
                                <Heading fontSize={20} mb='5px'>Leaderboard</Heading>
                                <Box w='190px'>
                                    {score}
                                </Box>
                                <Button isDisabled={gameState.length >= 4} onClick={addBot} size='sm' variant='outline'> Add bot</Button>
                            </Box>
                            <Flex>
                                
                                <ButtonGroup isAttached size='sm' variant='outline'>
                                    <Button disabled={!roundEnd} onClick={onOpen}>Summary</Button>
                                    <Button disabled={!roundEnd} onClick={handleNewGame}>New game</Button>
                                </ButtonGroup>
                            </Flex>
                            <Box>
                                <Text textAlign='left' p='0px' m='0px'>Invite link</Text>
                                <InputGroup>
                                    <Input h='30px' px='2px' variant='filled' value={hasCopied ? "Copied!" : window.location.href}  isReadOnly />
                                    <InputRightElement h='30px'>
                                        <Button h='30px' onClick={onCopy} variant='outline'> {hasCopied? <CheckIcon h='20px' /> : <CopyIcon h='20px' />} </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </Box>
                            <Spacer m='auto' />
                            <p>Connection Status: {connectionStatus}</p>
                        </VStack>

                    </TabPanel>
                    <TabPanel w='200px'>
                        <Flex w='100%' >
                            <strong>Name</strong>
                            <Spacer />
                            <strong>Double</strong>
                        </Flex>
                        {scoreTable}
                        <Flex w='100%' mt='10px' >
                            <strong>Instant Payout</strong>
                            <Spacer />
                            <strong>Points</strong>
                        </Flex>
                        {pettyTable}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}
