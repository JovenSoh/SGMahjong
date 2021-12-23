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

export function checkMahjong(hand) {
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

  //filter out the chows
  let chowSets = []
  for (let i=hand.length - 1; i>=2; i--) {
    if (hand[i]){
      let potentialChow =  hand.filter(e => (e.suit === hand[i].suit) && (e.value === hand[i].value-1 || e.value === hand[i].value-2 ) )
      potentialChow = getChow(potentialChow)
      if (potentialChow.length === 2) {
        chowSets = chowSets.concat([[potentialChow[0],potentialChow[1],hand[i]]])
        let chowA = hand.indexOf(hand[i])
        let chowB = hand.findIndex(e => (e.suit === potentialChow[1].suit && e.value === potentialChow[1].value && e.id === potentialChow[1].id))
        let chowC = hand.findIndex(e => (e.suit === potentialChow[0].suit && e.value === potentialChow[0].value && e.id === potentialChow[0].id))
        hand.splice(chowA,1)
        hand.splice(chowB,1)
        hand.splice(chowC,1)
      }
    }
  }

  //filter out the pongs
  const lookup = hand.reduce((a, e) => {
    a[`${e.suit} ${e.value}`] = ++a[`${e.suit} ${e.value}`] || 0;
    return a;
  }, {});

  let pongSets = hand.filter(e => lookup[`${e.suit} ${e.value}`] >= 2)
  hand = hand.filter(e => lookup[`${e.suit} ${e.value}`] < 2)

  let eye = hand
  console.log("Chow sets: ", chowSets)
  console.log("Pong sets: ", pongSets)
  console.log("Eye:", eye)
  //check eye
  if (eye.length === 2){
    if ((eye[0].suit === eye[1].suit) && (eye[0].value === eye[1].value)){
      return [true, chowSets, pongSets, eye, null]
    }
  }

  return [false]

}

export function checkGame(tiles, revealed, bonusTiles,tableWind,yourWind, lastDiscard,drawn) {
  let hand = tiles.concat(revealed.concat(lastDiscard).concat(drawn)).sort(compare)
  let mahjong = tiles.concat(revealed.concat(lastDiscard).concat(drawn)).sort(compare)
  let pointsLimit = 5
  let summary

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
     points: 5},
     {name: "十三幺",
     value: false,
     points: 5},
  ]
  
  let [game, chowSets, pongSets, eye, special] = checkMahjong(hand)

  //check strength of hand
  if (special){
    
    if (special === "七对子"){
      combination[combination.findIndex(e => e.name === "七对子")].value = true
    } else if (special === "十三幺"){
      combination[combination.findIndex(e => e.name === "十三幺")].value = true
    }
  }else if (game){
    //all pong game
    if (pongSets.length >= 12){
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
    let points = 0
    //count bonus tiles
    //animal tiles
    let animals = ['cat','mouse','rooster','centipede']
    let animalPoints = bonusTiles.filter(e => animals.includes(e.suit)).length
    console.log("Animals: ", animalPoints)
    //wind tiles
    let winds = ["~east","~south","~west","~north"]
    let windPoints = bonusTiles.filter(e => !animals.includes(e.suit) && winds[e.value-1] === yourWind ).length
    console.log("Winds: ", windPoints)
    //find honors tiles in pong sets
    let dragon = ["~red","~green","~white"]
    let dragonPoints = (pongSets.filter(e => dragon.includes(e.suit)).length/3)
    console.log("Dragon Tiles: ",dragonPoints)
    let tableWindPoints = (pongSets.filter(e => e.suit === tableWind).length/3)
    console.log("Table Wind: ",tableWindPoints)
    let yourWindPoints = (pongSets.filter(e => e.suit === yourWind).length/3)
    console.log("Your Wind: ",yourWindPoints)

    function add(accumulator, a) {
      return accumulator + a
    }
    //find the sum of all points in valid mahjong combinations
    let combinationPoints = combination.filter(e => e.value === true).map(e => e.points).reduce(add,0)
    console.log("Combi points: ", combinationPoints)

    points = (dragonPoints+tableWindPoints+yourWindPoints + combinationPoints + animalPoints + windPoints > pointsLimit) ? pointsLimit : dragonPoints+tableWindPoints+yourWindPoints + combinationPoints + animalPoints + windPoints
    console.log("Total points: ", points)

    summary = {
      animalPoints: animalPoints,
      windPoints: windPoints,
      dragonPoints: dragonPoints,
      tableWindPoints: tableWindPoints,
      yourWindPoints: yourWindPoints,
      combinationPoints: combinationPoints,
      totalPoints: points,
      selfDrawn: lastDiscard.length === 0? true : false
    } 
 }

  return [game, summary]
}
