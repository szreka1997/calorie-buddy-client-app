import { useState, useContext } from "react";

import { AuthContext } from "../../contexts/auth-context";
import { AlertContext } from "../../contexts/alert-context";
import { getDateShortStringFormat } from "../../utils/dateUtils";
import * as AuthService from "../../services/auth-service";

function useAuth() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);
  const alertCtx = useContext(AlertContext);

  function signup(values) {
    handleAuthFlow({ values, actionFn: AuthService.signupUser });
  }

  function login(values) {
    handleAuthFlow({ values, actionFn: AuthService.loginUser, isLogin: true });
  }

  async function handleAuthFlow({ values, actionFn, isLogin = false }) {
    setIsAuthenticating(true);
    try {
      const payload = !isLogin && {
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        registerDate: getDateShortStringFormat(new Date()),
      };
      const { token, id, refreshToken } = await actionFn({
        email: values.email,
        password: values.password,
        user: payload,
      });

      await authCtx.authenticate({
        token,
        id,
        refreshToken,
        isFirstLogin: !isLogin,
      });
    } catch (error) {
      alertCtx.showAlert({
        title: isLogin ? "Login Error!" : "Registration failed!",
        accent: !isLogin,
        error,
      });
    } finally {
      setIsAuthenticating(false);
    }
  }

  return {
    isAuthenticating,
    signup,
    login,
  };
}

export default useAuth;
