import {Image} from "@chakra-ui/react"

export default function Tile({picture, color, hoveredTile}){
    let shadowColor
    if (!color){
        shadowColor = "#343434"
    }else{
        shadowColor = color
    }

    //if there is a hovered tile
    if (hoveredTile){
        //if hovered tile has the same picture
        if (picture === hoveredTile.picture){
            return(
                <Image src={`https://raw.githubusercontent.com/JovenSoh/sgmahjong/gh-pages/images/${picture}.jpg`} fallbackSrc={"../images/" + picture + ".jpg"}  h={ window.innerHeight > window.innerWidth ? '8vw' : '6vh' } borderRadius="5px" borderWidth="1px" borderColor="#343434" borderStyle="solid" boxShadow={`3px 4px ${shadowColor}`} />
            )
        }else{
            return(
                <Image src={`https://raw.githubusercontent.com/JovenSoh/sgmahjong/gh-pages/images/${picture}.jpg`} fallbackSrc={"../images/" + picture + ".jpg"} h={ window.innerHeight > window.innerWidth ? '8vw' : '6vh' }  borderRadius="5px" borderWidth="1px" borderColor="#343434" borderStyle="solid" boxShadow={`3px 4px ${shadowColor}`} opacity="30%" />
            )            
        }
    }else{
        return (
            <Image src={`https://raw.githubusercontent.com/JovenSoh/sgmahjong/gh-pages/images/${picture}.jpg`} fallbackSrc={"../images/" + picture + ".jpg"}  h={ window.innerHeight > window.innerWidth ? '8vw' : '6vh' } borderRadius="5px" borderWidth="1px" borderColor="#343434" borderStyle="solid" boxShadow={`3px 4px ${shadowColor}`} />
        )
    }

}