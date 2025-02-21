import React, { useContext, useEffect, useState } from 'react'
import './RightSidebar.css';
import assets from '../../assets/assets';
import { logout } from '../../config/firebase';
import { AppContext } from '../../context/AppContext';

const RightSidebar = () => {

  const { chatUser, messages } = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);
  // const [avatar, setavatar] = useState(second) 

  useEffect(()=>{
    let temp = [];
    messages.map((msg)=>{
      if(msg.image){
        temp.push(msg.image);
      }
    })
    setMsgImages(temp);
    
  },[messages])

  return chatUser ? (
    <div className='rs' >
      <div className="rs-profile">
        <img src={chatUser.userData.avatar} alt="" />
        <h3>{chatUser.userData.name} {Date.now() - chatUser.userData.lastSeen <= 7000 ? <img  className="dot" src={assets.green_dot} alt="" /> : null}</h3>
        <p>{chatUser.userData.bio} </p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          {msgImages.map((url,index)=>(<img key={index} onClick={()=>window.open(url)} src={url} alt=''></img>))}
        </div>
      </div>
      <button type='submit' onClick={() => logout()}>Logout</button>
    </div >) : (
    <div className='rs'>
      <div className='info'>
        <h1>Guide</h1>
        <ul type="square">
          <li >Make sure that the user you are searching for has the account registered with "CHATTER BOX"</li>
          <br/>
          <li>For the first time you have to search the user via username and then that user will be permentaly there</li>
        </ul>
      </div>
      <button onClick={() => logout()} type="button">Logout</button></div>
  )
}

export default RightSidebar
