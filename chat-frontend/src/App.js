import "./App.css";

import SignIn from "./components/ui/sign/signIn/signin";
import SignUp from "./components/ui/sign/singUp/signup";

export default function App(){
  return(
    <div className="v">
      <SignIn/>
      <SignUp/>
    </div>
  )
}