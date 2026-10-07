import AuthContent from "../../components/Auth/AuthContent";
import LoadingOverlay from "../../components/UI/LoadingOverlay";
import useAuth from "../../hooks/auth/useAuth";

function LoginScreen() {
  const { isAuthenticating, login } = useAuth();

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging you in ..." />;
  }

  return <AuthContent isLogin onAuthenticate={login} />;
}

export default LoginScreen;
