import { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css';
import assets from '../../assets/assets';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Toastify from "toastify";
import upload from '../../lib/upload';
import { AppContext } from '../../context/AppContext';

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [avatar, setAvatar] = useState("");
  const {setUserData} = useContext(AppContext);

  const profileUpdate = async (event) => {
    console.log("Profile Update clicked");
    
    event.preventDefault();
    try {
      if(!avatar && image){
        console.log("Image needed!!");
        toast.error("Upload profile picture")
      }

      
      const docRef = doc(db,'users',uid);
      if(image){
        console.log("Image is => ",image);
        
        const imgUrl = await upload(image);
        setAvatar(imgUrl);
        console.log("Image is uploaded where ? ");
        
        await updateDoc(docRef,{
          avatar: imgUrl,
          bio: bio,
          name: name
        })

      } else{
        
        await updateDoc(docRef,{
          bio: bio,
          name: name,
        })
        
        const snap = await getDoc(docRef);
        setUserData(snap.data());
        toast.success("Profile updated successfully");
        navigate('/chat');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
  }

  useEffect(()=>{
    onAuthStateChanged(auth,async(user)=>{
      if(user){
        setUid(user.uid);
        const docRef = doc(db,'users',user.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.data().name){
          setName(docSnap.data().name);
        }
        if(docSnap.data().bio){
          setBio(docSnap.data().bio);
        }
        if(docSnap.data().avatar){
          setAvatar(docSnap.data().avatar);
        }
      } else{ //if user is logs out
        navigate('/');
      }
    })
  },[])

  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={profileUpdate} action="">
          <h3>Profile Details</h3>
          <label htmlFor='avtar'>
            <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='avtar' accept='.png,.jpg,.jpeg' hidden/>
            <img src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
            Change Profile Image
          </label>
          <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='Name' required/>
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio} type="text" placeholder='Write about your bio' name="" id="" required></textarea>
          <button type="submit" onClick={()=>navigate('/chat')} >Save</button>
          
        </form>
        <img className='profile-pic' src={image ? URL.createObjectURL(image) : avatar ? avatar : assets.logo_big} alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate
