//sort hand
export function compare( a, b ) {
    if ( a.suit < b.suit ){
      return -1;
    }
    if ( a.suit > b.suit ){
      return 1;
    }
    if ( a.suit === b.suit ){
      if ( a.value < b.value ){
        return -1;
      }
      if ( a.value > b.value ){
        return 1;
      }
    }
    return 0;
  }

export function getChow(chowSet) {
  const result = [];
  const map = new Map();
  for (const item of chowSet) {
      if(!map.has(item.value)){
          map.set(item.value, true);    // set any value to Map
          result.push({
              suit: item.suit,
              value: item.value,
              id: item.id,
              picture: item.picture
          });
      }
  }
  return result
}

export function checkHand(hand, winner, eye){
  console.log("Recursion",hand, winner, eye)
  //4 sets and an eye, so if there are more sets, it's wrong
  if (winner.length > 5){
    return [false,winner,eye]
  }
  //remove tiles marked as winning from hand
  if (winner.length > 0){
    winner.forEach((set) => {
      set.forEach((tile) => {
        hand = hand.filter(e => !((e.picture === tile.picture) && (e.id === tile.id)))
      })
    })
  }
  //base case, minimum of 2 tiles to form a set
  if (hand.length > 0){
    //check for chow
    let sequential = getChow(hand.filter(e => (e.suit === hand[0].suit) && (e.value === hand[0].value || e.value === hand[0].value+1 || e.value === hand[0].value+2)))
    //check for same tiles
    let same = hand.filter(e => e.picture === hand[0].picture)

    if (sequential.length == 3) {
      console.log("Sequential set", sequential)
      if (checkHand(hand,winner.concat([sequential]),eye)[0]){
        return checkHand(hand,winner.concat([sequential]),eye)
      }
    }
    if (same.length == 4){
      console.log("Kong set", same)
      if (checkHand(hand,winner.concat([same]),eye)[0]){
        return checkHand(hand,winner.concat([same]),eye)
      }
    }
    if (same.length == 3){
      console.log("Pong set", same)
      if (checkHand(hand,winner.concat([same]), eye)[0]){
        return checkHand(hand,winner.concat([same]),eye)
      }
    }
    if (same.length == 2 && !eye){
      console.log("Eye", same)
      if (checkHand(hand,winner.concat([same]), true)[0]){
        return checkHand(hand,winner.concat([same]),true)
      }
    }
    //if the current tile doesn't form a set, return false and stop this branch
    return [false, winner, eye]
  }else if (hand.length === 0){ //if there are no tiles left
    return [true, winner, eye]
  }
  
}

export function checkMahjong(hidden, revealed) {
  let hand=hidden.concat(revealed)
  //check for special cases
  //1. 7 pair
  const lookupPair = hand.reduce((a, e) => {
    a[`${e.suit} ${e.value}`] = ++a[`${e.suit} ${e.value}`] || 0;
    return a;
  }, {});

  let pairs = hand.filter(e => lookupPair[`${e.suit} ${e.value}`] === 1)

  console.log("Pairs: ",pairs)
  if (pairs.length === 14){
    return [true, [], [], [], "七对子"]
  }

  //2. 13 wonders
  let 十三幺 = hand.filter(e => (e.suit === "bamboo" && e.value === 1) || (e.suit === "bamboo" && e.value === 9) || (e.suit === "circles" && e.value === 1) || (e.suit === "circles" && e.value === 9) || (e.suit === "numbers" && e.value === 1) || (e.suit === "numbers" && e.value === 9) || (e.suit === "~north") || (e.suit === "~south") || (e.suit === "~east") || (e.suit === "~west") || (e.suit === "~red") || (e.suit === "~green") || (e.suit === "~white") )
  console.log("十三幺: ",十三幺)
  let 十三幺Unique =  [...new Map(十三幺.map(v => [JSON.stringify([v.suit,v.value]), v])).values()]
  if (十三幺.length === 14 && 十三幺Unique.length === 13){
    return [true,[],[],[],"十三幺"]
  }

  let [win, winningHand] = checkHand(hidden,[],false)
  let [temp, revealedHand] = checkHand(revealed,[],false)
  winningHand = revealedHand.concat(winningHand)
  if (win){
    console.log("Winning hand!", winningHand)
    let eye
    let same = []
    let sequentials = []
    winningHand.forEach((set) => {
      let set_temp = set.filter((tile) => tile.picture === set[0].picture)
      console.log("Set temp", set_temp)
      //handle same tiles
      if (set_temp.length > 1){
        if (set.length == 2){
          eye = set
        }else{
          same = same.concat([set])
        }
      }else{
        sequentials = sequentials.concat([set])
      }
    })
    return [true,sequentials,same,eye,null]
  }

  return [false,[],[],[],""]

}

export function checkGame(tiles, revealed, bonusTiles,tableWind,yourWind, lastDiscard,drawn) {
  let mahjong = tiles.concat(revealed.concat(lastDiscard).concat(drawn)).sort(compare)
  let pointsLimit = 5
  let summary, summary_combination

  //Mahjong hands
  let combination = [
     {name: "allPong",
     value: false,
     points: 2},
     {name: "臭平和",
     value: false,
     points: 1},
     {name: "平和",
     value: false,
     points: 4},
     {name: "清一色",
     value: false,
     points: 4},
     {name: "混一色",
     value: false,
     points: 2},
     {name: "oneNine",
     value: false,
     points: 5},
     {name: "halfOneNine",
     value: false,
     points: 1},
     {name: "七对子",
     value: false,
     points: 3},
     {name: "十三幺",
     value: false,
     points: 5},
  ]
  
  let [game, chowSets, pongSets, eye, special] = checkMahjong(tiles.concat(lastDiscard).concat(drawn).sort(compare), revealed)
  console.log("Pong Sets:", pongSets)
  console.log("Chow sets:", chowSets)
  console.log("Eye:", eye)

  //check strength of hand
  if (special){
    if (special === "七对子"){
      combination[combination.findIndex(e => e.name === "七对子")].value = true
    } else if (special === "十三幺"){
      combination[combination.findIndex(e => e.name === "十三幺")].value = true
    }
  }else if (game){
    //all pong game
    if (pongSets.length >= 4){
      combination[combination.findIndex(e => e.name === "allPong")].value = true
    }
    //check allChow
    // 1. The EYE cannot be a Dragon Tile or the Prevailing Wind or the Players Wind for that game
    if (eye[0].suit != '~red' && eye[0].suit != '~green' && eye[0].suit !='~white' && eye[0].suit != tableWind && eye[0].suit != yourWind){
      // 2. The tiles must be made up of one EYE and four CHOWs.
      if (chowSets.length === 4){
        // 3. If the player wins the game on a discarded tile, there must be more than one unique tile that could have caused the player to win the game
        if (lastDiscard.length !== 0){
          let winningSet = chowSets.filter(e => e.indexOf(lastDiscard) > 0 )
          if (winningSet[0] === lastDiscard || winningSet[2] === lastDiscard) {
            //check if there are bonus tiles
            if (bonusTiles.length === 0){
              combination[combination.findIndex(e => e.name === "平和")].value = true
            }else{
              combination[combination.findIndex(e => e.name === "臭平和")].value = true
            }
          }
        //3a.if it's self-drawn
        }else{
          if (bonusTiles.length === 0){
            combination[combination.findIndex(e => e.name === "平和")].value = true
          }else{
            combination[combination.findIndex(e => e.name === "臭平和")].value = true
          }
        }
      }
    }

    //check for color game
    let suits = [...new Set(mahjong.map(e => e.suit))]
    let honors = ['~east','~south','~west','~north','~red','~green','~white']
    console.log("Suits: ", suits)
    console.log("Filtered suits:", suits.filter(e => !honors.includes(e)))

    if (suits.length === 1){
      combination[combination.findIndex(e => e.name === "清一色")].value = true
    }else if (suits.filter(e => !honors.includes(e)).length === 1){
      combination[combination.findIndex(e => e.name === "混一色")].value = true
    }
    //check for ones and nines
    let one9 = [...new Set(mahjong.map(e => e.value))]
    console.log("oneNine: ", one9.filter(e => e !== 9 && e !== 1 && e !== null))

    if (one9.filter(e => e !== 9 && e !== 1).length === 0){
      combination[combination.findIndex(e => e.name === "oneNine")].value = true
    }else if (one9.filter(e => e !== 9 && e !== 1 && e !== null).length === 0){
      combination[combination.findIndex(e => e.name === "halfOneNine")].value = true
    }

    //count points
    let points = 0, dragonPoints = 0, tableWindPoints = 0, yourWindPoints = 0
    //count bonus tiles
    //animal tiles
    let animals = ['cat','mouse','rooster','centipede']
    let animalPoints = bonusTiles.filter(e => animals.includes(e.suit)).length
    console.log("Animals: ", animalPoints)
    //wind tiles
    let winds = ["~east","~south","~west","~north"]
    let flowerPoints = bonusTiles.filter(e => !animals.includes(e.suit) && winds[e.value-1] === yourWind ).length
    console.log("Flowers: ", flowerPoints)
    //find honors tiles in pong sets
    let dragon = ["~red","~green","~white"]
    pongSets.forEach((set) => {
      console.log("PongSets: ", set)
      dragonPoints += Math.floor(set.filter(e => dragon.includes(e.suit)).length/3)
      tableWindPoints += Math.floor(set.filter(e => e.suit === tableWind).length/3)
      yourWindPoints += Math.floor(set.filter(e => e.suit === yourWind).length/3)
    })
    console.log("Dragon Tiles: ",dragonPoints)
    console.log("Table Wind: ",tableWindPoints)
    console.log("Your Wind: ",yourWindPoints)

    function add(accumulator, a) {
      return accumulator + a
    }
    //find the sum of all points in valid mahjong combinations
    let combinationPoints = combination.filter(e => e.value === true).map(e => e.points).reduce(add,0)
    console.log("Combi points: ", combinationPoints)

    points = (dragonPoints+tableWindPoints+yourWindPoints + combinationPoints + animalPoints + flowerPoints > pointsLimit) ? pointsLimit : dragonPoints+tableWindPoints+yourWindPoints + combinationPoints + animalPoints + flowerPoints
    console.log("Total points: ", points)

    summary_combination = combination.filter(e => e.value === true).map(
      function(e){
        return {
          [e.name] : e.points
        }
      }
    )

    summary = {
      ...summary_combination[0],
      animalPoints: animalPoints,
      flowerPoints: flowerPoints,
      dragonPoints: dragonPoints,
      tableWindPoints: tableWindPoints,
      yourWindPoints: yourWindPoints,
      totalPoints: points,
      selfDrawn: lastDiscard.length === 0? true : false
    } 


 }

  return [game, summary]
}
