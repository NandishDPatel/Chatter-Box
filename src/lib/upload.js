import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// const upload = async (file) => {
//   const storage = getStorage();
//   console.log("File is defined like",file);
  
//   const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);//to store the file uniquely will use the timestamp 

//   const uploadTask = uploadBytesResumable(storageRef, file);

//   uploadTask.on(
//     "state_changed",
//     (snapshot) => {
//       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       console.log("Upload is " + progress + "% done");
//       switch (snapshot.state) {
//         case "paused":
//           console.log("Upload is paused");
//           break;
//         case "running":
//           console.log("Upload is running");
//           break;
//       }
//     },
//     (error) => {},
//     () => {
//       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//         resolve(downloadURL) //will return the download url when the image is uploaded 
//       });
//     }
//   );
// };

const upload = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      console.log("File is defined like", file);
  
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`); //to store the file uniquely will use the timestamp 
  
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          reject(error); 
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL); // resolve the promise with the download URL
          });
        }
      );
    });
  };

export default upload;