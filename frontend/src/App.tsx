import { useEffect, useState } from "react";
import SignIn from "./screens/SignIn";
import EmailTracker from "./screens/EmailTracker";

type Screens = "email-tracker" | "signIn" | "loading";

function App() {
  const [screen, setScreen] = useState<Screens>("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setScreen("email-tracker");
    } else {
      setScreen("signIn");
    }
  }, []);

  const map: Record<Screens, React.JSX.Element> = {
    loading: (
      <div className="absolute inset-0 flex items-center justify-center">
        Carregando...
      </div>
    ),
    "email-tracker": <EmailTracker />,
    signIn: (
      <SignIn
        toEmailTrackerScreen={() => {
          setScreen("email-tracker");
        }}
      />
    ),
  };

  return (
    <div className="bg-zinc-800 text-gray-50 absolute inset-0 overflow-auto">
      {map[screen]}
    </div>
  );
}

export default App;
