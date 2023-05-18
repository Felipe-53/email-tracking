import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { fetchJson } from "../utils/fetchJson";

interface Props {
  toEmailTrackerScreen: () => void;
}

const SignIn: React.FC<Props> = ({ toEmailTrackerScreen }) => {
  const [loginState, setLoginState] = React.useState<
    "idle" | "loading" | "error"
  >("idle");

  const map: Record<typeof loginState, React.JSX.Element> = {
    idle: <></>,
    loading: <span className="text-green-500">Autenticando...</span>,
    error: <span className="text-red-500">Erro ao fazer login</span>,
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-2">
        Email <span className="text-primary">Tracker</span>
      </h1>

      <p className="mb-10">Saiba quando seus e-mails forem abertos 🧐</p>

      <div className="relative">
        <div className="absolute -top-8 z-50 text-center left-0 right-0">
          {map[loginState]}
        </div>

        <GoogleOAuthProvider clientId="140569512127-te09lm9brpgk3khg8d31g102619umfm9.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              setLoginState("loading");
              const response = await fetchJson<{ token: string }>(
                "/google-sign-in",
                {
                  method: "POST",
                  body: JSON.stringify({
                    token: credentialResponse.credential,
                  }),
                }
              );
              if (!response.token) {
                setLoginState("error");
              } else {
                localStorage.setItem("token", response.token);
                toEmailTrackerScreen();
              }
            }}
            onError={() => {
              setLoginState("error");
            }}
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default SignIn;
