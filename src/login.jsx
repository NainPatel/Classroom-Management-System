import {Button, Checkbox, Label, Modal, TextInput,} from "flowbite-react";
import {useEffect, useRef, useState} from "react";
import app from './firebase_config.jsx'
import  google from  './assets/google.png'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup, GoogleAuthProvider
} from 'firebase/auth';
import {doc, getDoc, getFirestore, setDoc} from 'firebase/firestore'

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const firestore_database = getFirestore(app)


const Login =  ({openModal , setOpenModal }) => {

  const [Username, setUsername] = useState('')
  const [Email, setEmail] = useState('')
  const [Password, setPassword] = useState('')
  const [createAccount, setCreateAccount] = useState(false)
  const [Role, setRole] = useState('')


  // useEffect(() => {
  //   console.log(Email)
  // }, [Email]);

  const google_signin = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          alert(`welcome ${user.displayName}`)
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
  }

  const signup = () => {
    createUserWithEmailAndPassword(auth, Email, Password)
        .then((userCredential) => {
          updateProfile(auth.currentUser, {
            displayName: Username,
          }).then(async () => {
            const user = userCredential.user;

            const usr = {
              uid: user.uid,
              username: Username,
              email: user.email,
              role: Role, // Role is already set from the state
            };

            console.log(usr);

            const docRef = doc(firestore_database, "User", user.uid);
            const obj = {
              email: user.email,
              role: Role,
            };

            try {
              await setDoc(docRef, obj);
              setOpenModal(false);
              setRole("");
              setUsername("");
              setEmail("");
            } catch (error) {
              console.error("Error saving to Firestore:", error);
              alert("Failed to save user data. Please try again.");
            }
          });
        })
        .catch((error) => {
          console.error("Signup Error:", error);
          alert("Signup failed: " + error.message);
        });
  };


  const login = ()=>{
  signInWithEmailAndPassword(auth,Email,Password).then(() => {
    alert('logged in ')
  }).catch((error) => {
    alert("Error");
  });
}

 return ( <>
    <div>


      <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>

            {
              createAccount ? <div>
                <div className="mb-2 block">
                  <Label htmlFor="username" value="Your Username"/>
                </div>
                <TextInput id="username" value={Username} onChange={(event) => {
                  setUsername(event.target.value)
                }} placeholder="Enter Username" required/>
              </div> : null
            }
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your email"/>
              </div>
              <TextInput id="email" value={Email} onChange={(event) => {
                setEmail(event.target.value)
              }} placeholder="name@company.com" required/>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your password"/>
              </div>
              <TextInput id="password" type="password" value={Password} onChange={(event) => {
                setPassword(event.target.value)
              }} required/>
            </div>
            {
              createAccount ? (
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="role" value="Select Role" />
                    </div>
                    <select
                        name="role"
                        id="role"
                        value={Role} // Bind the state to the select element
                        onChange={(event) => {
                          const selectedRole = event.target.value; // Get the selected value
                          console.log("Selected Role:", selectedRole); // Debugging
                          setRole(selectedRole); // Update state with the selected value
                        }}
                        required
                    >
                      <option value="none">Select Role</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
              ) : null
            }



            <div className="w-full">
              {
                createAccount ?
                    <Button onClick={signup}>SignUp</Button>
                    :
                    <Button onClick={login}>Log in to your account</Button>
              }
            </div>

            {
              createAccount ? null : <div className="flex justify-center">
                <div>
                  <div className="mb-4">
                    --or--

                  </div>
              <img onClick={google_signin} alt={'google png'} className={'w-15 h-10'} src={google}/>
    </div>
 </div>
            }

            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              &nbsp;
              <a onClick={() => {
                setCreateAccount(!createAccount)
              }} className="text-cyan-700 hover:underline dark:text-cyan-500">
                {
                  !createAccount ? 'Create account' : 'Login to Account'
                }
              </a>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
 </>)

}

export default Login;