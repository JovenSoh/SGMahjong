import React, { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {Flex, Box, Center, Button, useDisclosure} from '@chakra-ui/react'
import { useParams } from "react-router-dom"
import { checkGame, compare, getChow } from './Mahjong';
import Board from './Board'
import ChowSelector from './ChowSelector';
import Summary from './Summary';
import Information from './Information';
import Draw from './Draw';
import Username from './Username';

export default function Table() {
  let sequentialTiles_top, sequentialTiles_mid, sequentialTiles_bot
  const gameId = useParams().gameId
  const [socketUrl, setSocketUrl] = useState(`ws://irscybersec.tk:3000/${gameId}`);
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
  const [pong, setPong] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure() //for multichow
  const [sequentialTiles, setSequentialTiles] = useState()
  const [chow, setChow] = useState(false)
  const [multiChow, setMultiChow] = useState(false)
  const [game, setGame] = useState(false)
  const [summary, setSummary] = useState()
  //others
  const [currentTurn, setCurrentTurn] = useState(false) //whether it is your turn
  const [draw, setDraw] = useState(false)
  const [roundEnd, setRoundEnd] = useState(false)
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
    game ? setGame(false) : setGame(false) //if self-drawn, set game back to false
    console.log("Discarding ", selectedTile)
    sendMessage('Discard: ' + JSON.stringify(selectedTile))
    //find the index of discarded tile in our hand
    let discard_index = tiles.filter(e => !((e.suit===selectedTile.suit) && (e.value===selectedTile.value) && (e.id===selectedTile.id)) )

    setTiles(discard_index)
    setSelectedTile(null)
    setCurrentTurn(false)
  }

  //functions for making moves (chow, pong, game)
  const checkValidMoves = (lastDiscard) => {
    if (lastDiscard){
      //check for winning hand
      let [game_temp, summary_temp] = checkGame(tiles,revealedTiles,bonusTiles,tableWind,yourWind, lastDiscard, [])
      setSummary(summary_temp)
      if (game_temp) {
        setGame(game_temp)
        setTimeout(() => {
          setGame(false)
        },3000)
      }
      //check for pong
      let sameTiles = tiles.filter(e => (e.suit === lastDiscard.suit) && (e.value === lastDiscard.value))
      console.log("Same tiles: ", sameTiles)
      if (sameTiles.length >= 2) {
        setPong(true)
        setTimeout(() => {
          setPong(false)
        },3000)
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
        setSequentialTiles(sequentialTiles_temp)
        
        if (sequentialTiles_temp.length > 1){
          setMultiChow(true)
          setTimeout(() => {
            setMultiChow(false)
          },3000)
        }

        if (sequentialTiles_top.length == 2 || sequentialTiles_mid.length == 2 || sequentialTiles_bot.length == 2){
          setChow(true)
          setTimeout(() => {
            setChow(false)
          },3000)
        }
      }
    }
  }

  const handlePong = () => {
    let pongSet = tiles.filter(e => (e.suit === lastDiscard.suit) && (e.value === lastDiscard.value)).concat(lastDiscard)
    sendMessage(clientID + " pong " + JSON.stringify(pongSet))
    setPong(false)
  }

  const handleChow = (multiChow) => {
    console.log("CHOW!")
    console.log("Sequential: ", sequentialTiles)
    let chowSet=[]
    //check for chow
    sequentialTiles_top = tiles.filter(e => (e.suit === lastDiscard.suit) && (e.value === lastDiscard.value-1 || e.value === lastDiscard.value-2 ) )
    sequentialTiles_mid = tiles.filter(e => (e.suit === lastDiscard.suit) && (e.value === lastDiscard.value-1 || e.value === lastDiscard.value+1 ) )
    sequentialTiles_bot = tiles.filter(e => (e.suit === lastDiscard.suit) && (e.value === lastDiscard.value+1 || e.value === lastDiscard.value+2 ) )

    if (sequentialTiles.length === 1){
      chowSet = sequentialTiles[0].concat(lastDiscard)
      console.log("Sequential Tiles:", sequentialTiles_top)
    }else if (sequentialTiles.length > 1){
      chowSet = multiChow.concat(lastDiscard)
      console.log("Sequential Tiles:", sequentialTiles_top)
      setMultiChow(false)
      setSequentialTiles()
      onClose()
    }

    sendMessage(clientID + " chow " + JSON.stringify(chowSet))
    setChow(false)
  }

  const handleMultiChow = () => {
    //check for multiple chows
    if (!isOpen){
      onOpen() //open modal
      console.log("Multi Chow detector: ", sequentialTiles)
      sendMessage(clientID + " multichow ")
    }
    setMultiChow(false)
  }

  const handleGame = () => {
    sendMessage(clientID + " WINS! "+JSON.stringify(summary)+" "+JSON.stringify(tiles))
    setGame(false)
  }

  const handleNewGame = () => {
    sendMessage("New game!")
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
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];
  
  useEffect(() => {
    if (lastMessage !== null) {
      console.log("Last message: ",lastMessage.data)
      setMessageHistory(prev => prev.concat(lastMessage));
      if (lastMessage.data.includes("Online users:")) {
        let userList = lastMessage.data.replace("Online users: ","")
        setOnlineUsers(userList)
      }else if (lastMessage.data.includes("Game state")) {
        let gameState_temp = lastMessage.data.replace("Game state: ","")
        console.log("Game state: ", gameState_temp)
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
        //if a new tile is drawn, check if 自摸
        if (tiles_temp.length !== 13){
          console.log("Tiles:",tiles)
          let [game_temp, summary_temp] = checkGame(tiles,revealedTiles,bonusTiles,tableWind,yourWind,[], tiles_temp)
          setGame(game_temp)
          setSummary(summary_temp)
          console.log(summary_temp)
        }
      } else if (lastMessage.data.includes("Bonus")) {
        let bonusTiles_temp = JSON.parse(lastMessage.data.replace("Bonus: ",""))
        setBonusTiles(prev => prev.concat(bonusTiles_temp))
      }else if (lastMessage.data.includes("Table wind")) {
        setTableWind(lastMessage.data.replace("Table wind: ",""))
      }else if (lastMessage.data.includes("Your wind")) {
        setYourWind(lastMessage.data.replace("Your wind: ",""))
      }else if (lastMessage.data.includes("It is your turn")) {
        setCurrentTurn(true)
      }else if (lastMessage.data.includes("Discards")) {
        let discards_temp = JSON.parse(lastMessage.data.replace("Discards: ", ""))
        setDiscards(discards_temp)
        setLastDiscard(discards_temp.at(-1))
        console.log("Last discarded", discards_temp.at(-1))
        checkValidMoves(discards_temp.at(-1))
      }else if (lastMessage.data.includes("Previous player: ")) {
        setPreviousPlayer(lastMessage.data.replace("Previous player: ",""))
      }else if (lastMessage.data.includes("Revealed")) {
        //sucessfull move made
        let revealedTiles_temp = JSON.parse(lastMessage.data.replace("Revealed: ",""))
        let newTiles = tiles
        console.log("New Tiles: ", newTiles)

        for (let i=0; i<revealedTiles_temp.length; i++){
          console.log("Target: ",revealedTiles_temp[i])
          console.log("Target Index: ", newTiles.indexOf(revealedTiles_temp[i]))
          newTiles = newTiles.filter((tile) => !((tile.suit === revealedTiles_temp[i].suit) && (tile.value === revealedTiles_temp[i].value)))
        }
        setTiles(newTiles)
        setRevealedTiles(prev => prev.concat(revealedTiles_temp).sort(compare))
      }else if (lastMessage.data.includes("Current player: ")){
        let currentPlayer_temp = lastMessage.data.replace("Current player: ","")
        setCurrentPlayer(currentPlayer_temp.substring(1, currentPlayer_temp.length-1))
      }else if (lastMessage.data.includes("New game!")) {
        setRoundEnd(false)
        setDiscards([])
        setLastDiscard()
        setTiles([])
        setBonusTiles([])
        setRevealedTiles([])
        setSelectedTile()
        setSummary()
      }else if (lastMessage.data.includes("wins")) {
        setRoundEnd(true)
        let summary_temp = JSON.parse(lastMessage.data.split(" ")[2])
        setSummary(summary_temp)
        setWinnerID(lastMessage.data.split(" ")[0])
      }else if (lastMessage.data.includes("Draw:")) {
        setDraw(true)
        setRoundEnd(true)
      }
    }
  }, [lastMessage, setMessageHistory]);


  return (
    <>
      <Username sendMessage={sendMessage} />
      <Flex>
        <Board clientID={clientID} tiles={tiles} newTile={newTile} handleSelectTile={handleSelectTile} currentTurn={currentTurn} currentPlayer={currentPlayer} gameState={gameState} discards={discards}  selectedTile={selectedTile} handleDiscard={handleDiscard} pong={pong} handlePong={handlePong} chow={chow} handleChow={handleChow} multiChow={multiChow} handleMultiChow={handleMultiChow} game={game} handleGame={handleGame} />
        <Information tableWind={tableWind} yourWind={yourWind} currentPlayer={currentPlayer} gameState={gameState} handleNewGame={handleNewGame} roundEnd={roundEnd} />
      </Flex>

      <Box>
        <ChowSelector sequentialTiles={sequentialTiles} isOpen={isOpen} onClose={onClose} handleChow = {handleChow} lastDiscard = {lastDiscard} />
        <Summary winnerID={winnerID} roundEnd={roundEnd} setRoundEnd={setRoundEnd} summary={summary} handleNewGame={handleNewGame} draw={draw} />
        <Draw draw={draw} setDraw={setDraw} roundEnd={roundEnd} setRoundEnd={setRoundEnd} handleNewGame={handleNewGame} />
        <p>Online Users: {onlineUsers} </p>

        <p>Connection Status: {connectionStatus}</p>
      </Box>
    </>
  );
};