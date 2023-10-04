import { Button, Label, TextInput, Checkbox } from "flowbite-react";
import { HiMail} from 'react-icons/hi';
import { TfiKey } from 'react-icons/tfi';
import {formTheme, buttonTheme}  from "../../components/FlowBiteStyles/Styles";
const LoginSection = (props) => {
  return (
    <>
    <div className=" text-6xl text-purple-800 drop-shadow-xl font-extrabold mt-32 text-center">Smart Pact</div>
    <form className="flex max-w-md flex-col gap-4 mt-14 mx-auto  bg-white shadow-2xl shadow-gray-300 px-10 py-10 rounded-lg overflow-hidden" onSubmit={props.handleLogin}>
      <div>
        <div className="mb-2 block">
          <Label theme={formTheme.label} htmlFor="sb-email" value="Email Address" />
        </div>
        <TextInput
          id="sb-email"
          icon={HiMail}
          theme= {formTheme.textInput}
          size="md"
          required
          type="email"  
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label theme={formTheme.label} htmlFor="sb-password" value="Password" />
        </div>
        <TextInput id="sb-password" icon={TfiKey} theme= {formTheme.textInput} required type="password" />
      </div>
      <div>
      Don't have an account yet?  
      <a
        href="/signup"
        className="font-bold text-purple-800 hover:underline dark:text-primary-500"
      > Sign up</a></div>  
      <Button theme={buttonTheme} color="purple" size="md" type="submit">Sign in</Button>
      <a
        href="#"
        className="font-bold text-purple-800 hover:underline dark:text-primary-500"
      > Forgot Password?</a>
    </form>
    </>
  );
};

const SignupSection = (props) => {
  return (
    <>
    <div className=" text-6xl text-purple-800 drop-shadow-xl font-extrabold mt-20 text-center">Smart Pact</div>
    <form
      className="flex max-w-lg flex-col gap-4 mt-8 mx-auto  bg-white shadow-2xl shadow-gray-300 px-10 py-10 rounded-lg overflow-hidden "
      onSubmit={props.handleSignup}
    >
      <div>
        
        <div className="mb-2 block">
          <Label theme={formTheme.label} htmlFor="fname" value="First name" />
        </div>
        <TextInput theme= {formTheme.textInput} id="fname" required shadow />
      </div>
      <div>
        <div className="mb-2 block">
          <Label theme={formTheme.label} htmlFor="lname" value="Last Name" />
        </div>
        <TextInput theme= {formTheme.textInput} id="lname" required shadow />
      </div>
      <div>
        <div className="mb-2 block">
          <Label theme={formTheme.label} htmlFor="email2" value="Your email" />
        </div>
        <TextInput
          id="email2"
          theme= {formTheme.textInput}
          required
          shadow
          type="email"
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label theme={formTheme.label} htmlFor="password2" value="Your password" />
        </div>
        <TextInput theme= {formTheme.textInput} id="password2" required shadow type="password" />
      </div>
      <div>
        <div className="mb-2 block">
          <Label theme={formTheme.label} htmlFor="repeat-password" value="Repeat password" />
        </div>
        <TextInput theme= {formTheme.textInput} id="repeat-password" required shadow type="password" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox theme={formTheme.checkbox} id="agree" />
        <Label className="flex" htmlFor="agree">
          <p>I agree with the terms and conditions</p>
        </Label>
      </div>
      <Button theme={buttonTheme} color="purple" type="submit">Register </Button>
      <div>
      Already have an account?  
      <a
        href="/login"
        className="font-bold text-purple-800 hover:underline dark:text-primary-500"
      > Sign in</a></div> 
    </form>
    </>
  );
};

export { LoginSection, SignupSection };
