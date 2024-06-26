import React, { useState, createContext } from "react";
import SplashScreenLoading from "../Components/SplashScreenLoading";

export const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    loading: false,

   
  });

  return (
    <UserContext.Provider value={[user, setUser]}>
    
      {props.children}
    </UserContext.Provider>
  );
};
