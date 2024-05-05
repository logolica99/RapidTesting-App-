import SplashScreenLoading from "./Components/SplashScreenLoading";
import { UserContextProvider } from "./Contexts/UserContext";
import Main from "./Screens/Main";
import { decode, encode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

export default function App() {
  return (
    <UserContextProvider>
      <Main />
    </UserContextProvider>
  );
}
