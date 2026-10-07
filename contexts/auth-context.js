import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";

import { UserContext } from "./user-context";
import * as AuthService from "../services/auth-service";

export const AuthContext = createContext({
  isAuthenticated: false,
  isFirstLogin: false,
  setIsFirstLogin: async (value) => {},
  authenticate: async ({ token, id, refreshToken, isFirstLogin = false }) => {},
  getTokenAndId: async () => {},
  logout: () => {},
});

function AuthContectProvider({ children }) {
  const [authState, setAuthState] = useState();
  const [isFirstLoginState, setIsFirstLoginState] = useState(false);

  const userCtx = useContext(UserContext);

  async function setIsFirstLogin(value) {
    setIsFirstLoginState(value);
    await SecureStore.setItemAsync("isFirstLogin", value ? "true" : "false");
  }

  async function authenticate({
    token,
    id,
    refreshToken,
    isFirstLogin = false,
  }) {
    setAuthState({ token, id, refreshToken });

    await setIsFirstLogin(isFirstLogin);
    if (!isFirstLogin) await userCtx.fetchData({ token, userId: id });

    await Promise.all([
      SecureStore.setItemAsync("id", id),
      SecureStore.setItemAsync("refreshToken", refreshToken),
    ]);
  }

  async function getTokenAndId() {
    if (authState?.token) {
      const decodedToken = jwtDecode(authState.token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp > currentTime) {
        return { token: authState.token, id: authState?.id };
      }
    }

    console.log("TOKEN FRISSITÉS");

    // Token is expired or doesn't exist, try to refresh
    const result = await SecureStore.getItemAsync("isFirstLogin");
    const storedId = await SecureStore.getItemAsync("id");
    const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");

    const storedIsFirstLogin = result === "true";

    if (storedId && storedRefreshToken) {
      const { token, refreshToken } = await AuthService.refreshIdToken({
        userId: storedId,
        refreshToken: storedRefreshToken,
      });
      await authenticate({
        token,
        id: storedId,
        refreshToken,
        isFirstLogin: storedIsFirstLogin,
      });
      return { token, id: storedId };
    } else {
      return { token: null, id: null };
    }
  }

  function logout() {
    userCtx.deleteData();
    setAuthState(null);
    SecureStore.deleteItemAsync("id");
    SecureStore.deleteItemAsync("refreshToken");
    SecureStore.deleteItemAsync("isFirstLogin");
  }

  const value = {
    isAuthenticated: !!authState?.token,
    isFirstLogin: isFirstLoginState,
    setIsFirstLogin,
    authenticate,
    getTokenAndId,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContectProvider;
