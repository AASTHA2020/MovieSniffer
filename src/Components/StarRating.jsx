import React, { useState } from 'react'

const containerStyle = {
    display:'flex',
    alignItems:'center',
    gap:'16px'
}

const starContainer = {
    display:'flex',
}

const text = {
    color: '#FFD700',
    fontSize:'24px'
}

function StarRating({star = 5,onSetRating}){

const [rating, setRating] = useState(0)
const [tempRating,setTempRating] = useState(0)

function handleSetRating(rating){
    setRating(rating)
    onSetRating(rating)
}

    return(
        <div style = {containerStyle}>
        <div style = {starContainer}>
            {Array.from({length:star},(_,i)=>(
            <>
                <Star key={i} 
                      onRate = {()=>handleSetRating(i+1)} 
                      flag={tempRating ? tempRating >= i+1 : rating >= i+1}
                      onMouseHover = {()=>setTempRating(i+1)}
                      onMourseLeave = {()=>setTempRating(0)}
                />
            </>
            ))}
        </div>
        <p style = {text}>{tempRating|| rating}</p>
        </div>

    )
}

const StarStyle = {
    width:'24px',
    height:'24px',
    display:'block',
    cursor:'pointer'
}

function Star({onRate,flag,onMouseHover,onMourseLeave}){
    return(
    <span role = 'button' 
          style={StarStyle} 
          onClick={onRate}
          onMouseEnter={onMouseHover}
          onMouseLeave={onMourseLeave}      
    >
    {flag ? <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="#FFD700"
        stroke="#FFD700"
        >
        <path
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
    </svg>
    :
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="#FFD700"
    >
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="{2}"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
    </svg>
}
    </span>
    )
}


export default StarRating;