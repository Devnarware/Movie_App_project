import {useEffect, useState} from "react";


const Card = (props) => {

  const checker = ()=>{
    if(liked){
      setLiked(false)
    }else{
      setLiked(true)
    }
  }

  const [liked, setLiked] = useState(false);

    useEffect(() => {
        console.log(`${props.name} has been ${liked ? 'liked' : 'disliked'}`)
    }, [liked]);


  return (
    <div className='
         px-5 py-3
        border border-amber-50 rounded-2xl
        bg-[#534e4e89]
         flex  gap-5'>

      <h1 className={'text-2xl font-semibold text-amber-50'}>
        {props.name}
      </h1>
      <button
        className={'cursor-pointer '}
        onClick={
           checker
          }
      >{liked ? '❤️': '🤍'}</button>
    </div >
  )
}

export default Card