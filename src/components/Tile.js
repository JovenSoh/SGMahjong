import {Image} from "@chakra-ui/react"

export default function Tile({picture, color, hoveredTile}){
    if (!color){
        let color = "#343434"
    }

    //if there is a hovered tile
    if (hoveredTile){
        //if hovered tile has the same picture
        if (picture === hoveredTile.picture){
            return(
                <Image src={`https://raw.githubusercontent.com/JovenSoh/sgmahjong/gh-pages/images/${picture}.jpg`} fallbackSrc={"../images/" + picture + ".jpg"}  h="6vh" borderRadius="5px" borderWidth="1px" borderColor="#343434" borderStyle="solid" boxShadow={`3px 4px ${color}`} />
            )
        }else{
            return(
                <Image src={`https://raw.githubusercontent.com/JovenSoh/sgmahjong/gh-pages/images/${picture}.jpg`} fallbackSrc={"../images/" + picture + ".jpg"} opacity="30%"  h="6vh" borderRadius="5px" borderWidth="1px" borderColor="#343434" borderStyle="solid" boxShadow={`300px 400px 100px ${color}`} />
            )            
        }
    }else{
        return (
            <Image src={`https://raw.githubusercontent.com/JovenSoh/sgmahjong/gh-pages/images/${picture}.jpg`} fallbackSrc={"../images/" + picture + ".jpg"}  h="6vh" borderRadius="5px" borderWidth="1px" borderColor="#343434" borderStyle="solid" boxShadow={`3px 4px ${color}`} />
        )
    }

}