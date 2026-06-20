import { createContext, useContext, useState } from "react";

const AuthStateContext = createContext({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, _setUser] = useState(
    JSON.parse(localStorage.getItem("authUser"))
  );

  const setUser = (user) => {
    _setUser(user);

    if (user) {
      localStorage.setItem(
        "authUser",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem("authUser");
    }
  };

  return (
    <AuthStateContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuthStateContext = () =>
  useContext(AuthStateContext);