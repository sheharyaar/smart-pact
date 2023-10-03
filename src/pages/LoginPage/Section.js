import { Button, Label, TextInput, Checkbox } from "flowbite-react";

const LoginSection = (props) => {
  return (
    <form className="flex max-w-md flex-col gap-4" onSubmit={props.handleLogin}>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="sb-email" value="Your email" />
        </div>
        <TextInput
          id="sb-email"
          placeholder="john@gmail.com"
          required
          type="email"
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="sb-password" value="Your password" />
        </div>
        <TextInput id="sb-password" required type="password" />
      </div>
      Don’t have an account yet?
      <a
        href="/signup"
        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
      >
        Sign up
      </a>
      <Button type="submit">Submit</Button>
    </form>
  );
};

const SignupSection = (props) => {
  return (
    <form
      className="flex max-w-md flex-col gap-4"
      onSubmit={props.handleSignup}
    >
      <div>
        <div className="mb-2 block">
          <Label htmlFor="fname" value="First name" />
        </div>
        <TextInput id="fname" placeholder="John" required shadow />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="lname" value="Last Name" />
        </div>
        <TextInput id="lname" placeholder="Doe" required shadow />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email2" value="Your email" />
        </div>
        <TextInput
          id="email2"
          placeholder="name@flowbite.com"
          required
          shadow
          type="email"
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password2" value="Your password" />
        </div>
        <TextInput id="password2" required shadow type="password" />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="repeat-password" value="Repeat password" />
        </div>
        <TextInput id="repeat-password" required shadow type="password" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="agree" />
        <Label className="flex" htmlFor="agree">
          <p>I agree with the terms and conditions</p>
        </Label>
      </div>
      <Button type="submit">Register new account</Button>
    </form>
  );
};

export { LoginSection, SignupSection };
