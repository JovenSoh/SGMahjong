import React, { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {Box, Flex, Button, Collapse, useDisclosure} from '@chakra-ui/react'
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import { useParams } from "react-router-dom"
import { checkGame, compare, getChow } from './Mahjong';
import Board from './Board'
import Summary from './Summary';
import Information from './Information';
import Username from './Username';

export default function Table() {
  let sequentialTiles_top, sequentialTiles_mid, sequentialTiles_bot, validMove_temp
  const gameId = useParams().gameId
  //socket stuff
  const [socketUrl, setSocketUrl] = useState(`wss://mahjong.irscybersec.ml/api/${gameId}`); //`ws://localhost:3001/${gameId}` || `wss://mahjong.irscybersec.ml/api/${gameId}`
  const [messageHistory, setMessageHistory] = useState([]);
  //set users
  const [onlineUsers, setOnlineUsers] = useState([])
  const [clientID, setClientID] = useState([])
  const [winnerID, setWinnerID] = useState()
  const [currentPlayer, setCurrentPlayer] = useState()
  const [previousPlayer, setPreviousPlayer] = useState(null)
  //set tiles
  const [tiles, setTiles] = useState([])
  const [newTile, setNewTile] = useState()
  const [bonusTiles, setBonusTiles] = useState([])
  const [revealedTiles, setRevealedTiles] = useState([])
  //set winds
  const [yourWind, setYourWind] = useState('')
  const [tableWind, setTableWind] = useState('')
  //discard pile
  const [discards, setDiscards] = useState([])
  const [lastDiscard, setLastDiscard] = useState()
  //moves
  const [validMove, setValidMove] = useState(false)
  const [sequentialTiles, setSequentialTiles] = useState([])
  const [pongTiles, setPongTiles] = useState([])
  const [kongTiles, setKongTiles] = useState([])
  const [game, setGame] = useState(false)
  const [summary, setSummary] = useState()
  //others
  const [currentTurn, setCurrentTurn] = useState(false) //whether it is your turn
  const { isOpen: isOpenSummary, onOpen: onOpenSummary, onClose: onCloseSummary } = useDisclosure() //for Summary
  const { isOpen: isOpenInformation, onClose: onCloseInformation, onToggle: onToggleInformation} = useDisclosure() //for Information
  const [draw, setDraw] = useState(false)
  const [roundEnd, setRoundEnd] = useState(false)
  const [minimumPoints, setMinimumPoints] = useState(1)
  const [delay, setDelay] = useState(3000) //set turn timer
  const [gameState, setGameState] = useState([]) 
  /* [  socket: Websocket,
        playerID: playerID,
        handLength: number of tiles,
        bonusTiles: bonus tiles,
        revealedTile": revealed tiles }] */

  //select tiles
  const [selectedTile, setSelectedTile] = useState(null)
  const handleSelectTile = (tile) => {
    console.log(tile)
    setSelectedTile(tile)
  }

  //discarding tiles
  const handleDiscard = () => {
    if (!roundEnd){
      game ? setGame(false) : setGame(false) //if self-drawn, set game back to false
      //if there was a valid move, set it to false and send skip to server
      if (validMove) {
        setValidMove(false)
        sendMessage(clientID + " skip")
      }
      console.log("Discarding ", selectedTile)
      sendMessage('Discard: ' + JSON.stringify(selectedTile))
      //filter out the discarded tile from our hand
      let newTiles = tiles.filter(e => !((e.suit===selectedTile.suit) && (e.value===selectedTile.value) && (e.id===selectedTile.id)) )

      setTiles(newTiles)
      setSelectedTile(null)
      //empty kong tiles if I'm not using it
      setKongTiles([])
      setCurrentTurn(false)
    }
  }

  //function for checking for immediate payouts
  const checkPetty = (bonuses) => {
    //check within the new bonus tiles
    //predator prey
    if (bonuses.filter(e => (e.suit === "cat") || (e.suit === "mouse")).length === 2){
      console.log("CAT MOUSE PAIR")
      sendMessage("AnimalPair")
    } else if (bonuses.filter(e => (e.suit === "rooster") || (e.suit === "centipede")).length === 2){
      console.log("ROOSTER CENTIPEDE PAIR")
      sendMessage("AnimalPair")
    }

    if (bonuses.filter(e => (e.value === 1)).length === 2){
      console.log("FlowerPair 1")
      sendMessage("FlowerPair ~east")
    } else if (bonuses.filter(e => (e.value === 2)).length === 2){
      console.log("2 FLOWER PAIR")
      sendMessage("FlowerPair ~south")
    } else if (bonuses.filter(e => (e.value === 3)).length === 2){
      console.log("3 FLOWER PAIR")
      sendMessage("FlowerPair ~west")
    } else if (bonuses.filter(e => (e.value === 4)).length === 2){
      console.log("4 FLOWER PAIR")
      sendMessage("FlowerPair ~north")
    }

    //flowers
    //for each bonus
    bonuses.forEach(bonus => {
      //check for predator prey
      if ((bonus.suit === "mouse" && bonusTiles.filter(e => e.suit === "cat").length > 0) || (bonus.suit === "cat" && bonusTiles.filter(e => e.suit === "mouse").length > 0) ){
        console.log("CAT MOUSE PAIR")
        sendMessage("AnimalPair")
      }else if ((bonus.suit === "rooster" && bonusTiles.filter(e => e.suit === "centipede").length > 0) || (bonus.suit === "centipede" && bonusTiles.filter(e => e.suit === "rooster").length > 0) ){
        console.log("ROOSTER CENTIPEDE PAIR")
        sendMessage("AnimalPair")
      }

      //check for flower pair
      if (bonusTiles.filter(e => e.value === bonus.value).length === 1){
        console.log(`${bonus.value} FLOWER PAIR`)
      }
    })
  }

  const lookup = tiles.reduce((a, e) => {
    a[`${e.suit} ${e.value}`] = ++a[`${e.suit} ${e.value}`] || 0;
    return a;
  }, {});

  const checkKong = (newTile) => {
    //check kong within hand
    let four_concealed = tiles.filter(e => (e.suit === newTile.suit) && (e.value === newTile.value)).concat(newTile)
    let kongSets = tiles.filter(e => lookup[`${e.suit} ${e.value}`] == 3)

    if (four_concealed.length == 4){
      setKongTiles([four_concealed.concat("four")])
      console.log("Four concealed kong", four_concealed)
    }else if(kongSets){
      setKongTiles([kongSets.concat("four")])
      console.log("kongSets", kongSets)
    }

    //check kong in exposed
    let gameStateIndex = gameState.findIndex(e => e.playerID === clientID)
    let exposed = gameState[gameStateIndex].revealedTiles
    let one_concealed = exposed.filter(e => (e.suit === newTile.suit) && (e.value === newTile.value)).concat(newTile)
    if (one_concealed.length == 4){
      setKongTiles([one_concealed.concat("one")])
      console.log("One concealed kong",one_concealed)
    }
  }

  //functions for making moves (chow, pong, kong, game)
  const checkValidMoves = (lastDiscard) => {
    validMove_temp = false
    //if there was a last discard and last discarder is not the player
    if (lastDiscard && clientID !== previousPlayer){
      //check for winning hand
      let [game_temp, summary_temp] = checkGame(tiles,revealedTiles,bonusTiles,tableWind,yourWind, lastDiscard, [])
      setSummary(summary_temp)
      console.log("Summary: ",summary_temp)
      //if the discarded tile builds a winning hand and has more than minimum points
      if (game_temp && summary_temp.totalPoints >= minimumPoints) {
        setValidMove(true)
        validMove_temp = true
        setGame(game_temp)
      }
      //check for pong
      let sameTiles = tiles.filter(e => (e.suit === lastDiscard.suit) && (e.value === lastDiscard.value)).concat(lastDiscard)
      console.log("Same tiles: ", sameTiles)
      if (sameTiles.length == 3) {
        setValidMove(true)
        validMove_temp = true
        setPongTiles([sameTiles])
      }else if (sameTiles.length == 4){
        setValidMove(true)
        validMove_temp = true
        setKongTiles([sameTiles.concat("three")])
      }

      //check if last discard is from the guy before you
      if (gameState.at(gameState.findIndex(e => e.playerID===clientID) - 1).playerID === previousPlayer){
        //check for chow
        sequentialTiles_top = tiles.filter(e => (e.suit === lastDiscard.suit) && (e.value === lastDiscard.value-1 || e.value === lastDiscard.value-2 ) )
        sequentialTiles_mid = tiles.filter(e => (e.suit === lastDiscard.suit) && (e.value === lastDiscard.value-1 || e.value === lastDiscard.value+1 ) )
        sequentialTiles_bot = tiles.filter(e => (e.suit === lastDiscard.suit) && (e.value === lastDiscard.value+1 || e.value === lastDiscard.value+2 ) )
        //check for unique chow values
        sequentialTiles_top = getChow(sequentialTiles_top)
        sequentialTiles_mid = getChow(sequentialTiles_mid)
        sequentialTiles_bot = getChow(sequentialTiles_bot)
        //check for multiple chows
        let sequentialTiles_temp = [sequentialTiles_top,sequentialTiles_mid,sequentialTiles_bot].filter(e => e.length===2)

        if (sequentialTiles_temp.length > 0){
          setValidMove(true)
          validMove_temp = true
          setSequentialTiles(sequentialTiles_temp)
        }

      }
    }
    //tell server that to wait for our valid move
    if (validMove_temp) {
      sendMessage(clientID + " validMove")
    }
  }

  const handleSkip = () => {
    console.log("SKIP!")
    sendMessage(clientID + " skip")
    setValidMove(false)
    setGame(false)
    setPongTiles([])
    setKongTiles([])
    setSequentialTiles([])
  }

  const handlePong = (pongSet) => {
    console.log("PONG!", pongTiles)
    setValidMove(false)
    setPongTiles([])
    sendMessage(clientID + " pong " + JSON.stringify(pongSet))
  }

  const handleKong = (kongSet, type) => {
    console.log("KONG!", kongSet, type)
    setValidMove(false)
    setKongTiles([])
    if (type === "three"){
      sendMessage(clientID + " threekong " + JSON.stringify(kongSet))
    }else if (type==="four"){
      sendMessage(clientID + " fourkong " + JSON.stringify(kongSet))
    }else if (type==="one"){
      sendMessage(clientID + " onekong " + JSON.stringify([kongSet[0]]))
    }
  }

  const handleChow = (chowSet) => {
    console.log("CHOW!", sequentialTiles)
    setValidMove(false)
    setSequentialTiles([])
    sendMessage(clientID + " chow " + JSON.stringify(chowSet))
  }

  const handleGame = () => {
    sendMessage(clientID + " WINS! "+JSON.stringify(summary)+" "+JSON.stringify(tiles))
    setValidMove(false)
    setGame(false)
    setTiles([])
  }

  const handleNewGame = () => {
    sendMessage("New game!")
  }

  const addBot = () => {
    sendMessage("addBot")
  }

  const {
    sendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Connected',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Disconnected',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];
  
  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory(prev => prev.concat(lastMessage));
      console.log("Last message:", lastMessage.data)
      if (lastMessage.data.includes("Online users:")) {
        let userList = lastMessage.data.replace("Online users: ","")
        setOnlineUsers(userList)
      }else if (lastMessage.data.includes("Game state")) {
        let gameState_temp = lastMessage.data.replace("Game state: ","")
        setGameState(JSON.parse(gameState_temp))
      }else if (lastMessage.data.includes("Your ID")) {
        let clientID_temp = lastMessage.data.replace("Your ID: ","")
        setClientID(clientID_temp)
      } else if (lastMessage.data.includes("Tiles")) {
        let tiles_temp = JSON.parse(lastMessage.data.replace("Tiles: ",""))
        if (tiles_temp.length === 13){
          setTiles(tiles_temp.sort(compare)) //new hand
        }else{
          setTiles(prev => prev.concat(tiles_temp).sort(compare)) //new tile
        }
        setNewTile(tiles_temp)
        console.log("New tiles:", tiles_temp)
        //if a new tile is drawn, check if 自摸 or concealed kong
        if (tiles_temp.length !== 13){
          console.log("Tiles:",tiles)
          let [game_temp, summary_temp] = checkGame(tiles,revealedTiles,bonusTiles,tableWind,yourWind,[], tiles_temp)
          setValidMove(game_temp)
          checkKong(tiles_temp)
          setGame(game_temp)
          setSummary(summary_temp)
        }
      } else if (lastMessage.data.includes("Bonus")) {
        let bonusTiles_temp = JSON.parse(lastMessage.data.replace("Bonus: ",""))
        checkPetty(bonusTiles_temp)
        setBonusTiles(prev => prev.concat(bonusTiles_temp))
      }else if (lastMessage.data.includes("Table wind")) {
        setTableWind(lastMessage.data.replace("Table wind: ",""))
      }else if (lastMessage.data.includes("Your wind")) {
        setYourWind(lastMessage.data.replace("Your wind: ",""))
      }else if (lastMessage.data.includes("It is your turn")) {
        setCurrentTurn(true)
      }else if (lastMessage.data.includes("Discards")) {
        let discards_temp = JSON.parse(lastMessage.data.replace("Discards: ", ""))
        //only set the last discard if a new tile is discarded, this is to avoid taking the last discard when someone else takes the last discard
        if (discards_temp.length > discards.length) {
          setLastDiscard(discards_temp.at(-1))
          checkValidMoves(discards_temp.at(-1))
          console.log("Last discarded", discards_temp.at(-1))
        }else{
          setLastDiscard()
        }
        setDiscards(discards_temp)
      }else if (lastMessage.data.includes("Previous player: ")) {
        setPreviousPlayer(lastMessage.data.replace("Previous player: ",""))
      }else if (lastMessage.data.includes("Pong!")){
        sendMessage("Ping!")
      }else if (lastMessage.data.includes("Revealed")) {
        //sucessfull move made
        let revealedTiles_temp = JSON.parse(lastMessage.data.replace("Revealed: ",""))
        let newTiles = tiles
        console.log("New Tiles: ", newTiles)
        //remove from our hand
        for (let i=0; i<revealedTiles_temp.length; i++){
          console.log("Target: ",revealedTiles_temp[i])
          console.log("Target Index: ", newTiles.indexOf(revealedTiles_temp[i]))
          newTiles = newTiles.filter((tile) => !((tile.suit === revealedTiles_temp[i].suit) && (tile.value === revealedTiles_temp[i].value) && (tile.id === revealedTiles_temp[i].id)))
        }
        setTiles(newTiles)
        setRevealedTiles(prev => prev.concat(revealedTiles_temp).sort(compare))
      }else if (lastMessage.data.includes("Current player: ")){
        let currentPlayer_temp = lastMessage.data.replace("Current player: ","")
        setCurrentPlayer(currentPlayer_temp.substring(1, currentPlayer_temp.length-1))
      }else if (lastMessage.data.includes("New game!")) {
        setRoundEnd(false)
        setDraw(false)
        setDiscards([])
        setLastDiscard()
        setBonusTiles([])
        setRevealedTiles([])
        setSelectedTile()
      }else if (lastMessage.data.includes("wins")) {
        sendMessage("ShowAll: " + JSON.stringify(tiles))
        setTiles([])
        setRoundEnd(true)
        let summary_temp = JSON.parse(lastMessage.data.split(" ")[2])
        setSummary(summary_temp)
        setWinnerID(lastMessage.data.split(" ")[0])
      }else if (lastMessage.data.includes("Draw:")) {
        setDraw(true)
        setRoundEnd(true)
        sendMessage("ShowAll: " + JSON.stringify(tiles))
        setTiles([])
      }
    }
  }, [lastMessage, setMessageHistory]);


  return (
    <Box h='100vh' w='100vw' bg='#E3DBB3'>
      <Username sendMessage={sendMessage} />
      
      <Flex zIndex={1} w='100%' m='auto' position="absolute" >
        <Board clientID={clientID} tiles={tiles} newTile={newTile} handleSelectTile={handleSelectTile} currentTurn={currentTurn} currentPlayer={currentPlayer} gameState={gameState} discards={discards}  selectedTile={selectedTile} handleDiscard={handleDiscard} lastDiscard={lastDiscard} pongTiles={pongTiles} handlePong={handlePong}handleChow={handleChow} sequentialTiles={sequentialTiles} kongTiles={kongTiles} handleKong={handleKong} game={game} handleGame={handleGame} validMove={validMove} handleSkip={handleSkip} />
      </Flex>

      
      <Flex zIndex={2}  float="right" position="relative">
        <Collapse in={!isOpenInformation} onClose={onCloseInformation} placement='right' >
          <Information tableWind={tableWind} yourWind={yourWind} playerID={clientID} currentPlayer={currentPlayer} gameState={gameState} handleNewGame={handleNewGame} roundEnd={roundEnd} onOpen={onOpenSummary} addBot={addBot} connectionStatus={connectionStatus} />
        </Collapse>
      </Flex>

      <Flex zIndex={2}  float="right" position="relative">
        <Button variant="link" _focus={false} onClick={onToggleInformation} alignItems='top' mt='3vh' h='50px'> {!isOpenInformation? <CloseIcon boxSize={4} /> : <HamburgerIcon boxSize={6} /> } </Button>
      </Flex>

      <Summary username={gameState.find(e => e.playerID === winnerID)} roundEnd={roundEnd} summary={summary} handleNewGame={handleNewGame} draw={draw} isOpen={isOpenSummary} onOpen={onOpenSummary} onClose={onCloseSummary} />
    </Box>
  );
};