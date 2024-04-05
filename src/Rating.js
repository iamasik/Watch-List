import { useState } from "react"
import PropType from 'prop-types'

function OnRate({onHover,Temp,value,onHoverOut,onStar,width}){
    return(
         <span style={{float:'left'}}  onClick={onStar} onMouseEnter={onHover} onMouseOut={onHoverOut} >
            {value<=Temp? <img src="star2.svg" style={{padding:'3px'}} width={width} height={width} alt=""/> : <img src="star.svg" style={{padding:'3px'}} width={width} height={width} alt=""/>}
        </span>
    )
}

// Prop Validator using PropType
RatingBox.prototype={
    Number:PropType.number,
    width:PropType.number,
    colors:PropType.string,
    SetExternal:PropType.func,

}
export default function RatingBox({Number=5,width=24,colors='#FFD700',SetExternal }){
    const Box={
        display:"flex",
        justifyContent:'flex-start',
        alignItems:'center'
    }
    const NumRate={
        color:colors,
        fontSize: '20px',
        fontWeight: 'bold',
        marginLeft: '10px',
    }
    const [Temp,SetTemp]=useState(0)
    const [Star,SetStar]=useState(0)
    function RateUpdate(Rating){
        SetStar(Rating)
        if(SetExternal) SetExternal(Rating)
    }
    const Data=Array.from({ length: Number }, (_, index) => index + 1)
    return(
        <div style={Box}>
            <div className="Ratings">
                {Data.map((pos,x)=><OnRate 
                key={x}
                value={pos} 
                Temp={Temp} 
                width={width}
                onStar={()=>RateUpdate(pos)} 
                onHoverOut={()=>SetTemp(Star?Star:0)} 
                onHover={()=>SetTemp(pos)}
                />)}
            </div>
            <div style={NumRate}>
                {Star?Star:Temp===0?"":Temp}
            </div>
        </div>
    )
}
