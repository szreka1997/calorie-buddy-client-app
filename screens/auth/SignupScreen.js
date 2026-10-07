import AuthContent from "../../components/Auth/AuthContent";
import LoadingOverlay from "../../components/UI/LoadingOverlay";
import useAuth from "../../hooks/auth/useAuth";

function SignupScreen() {
  const { isAuthenticating, signup } = useAuth();

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user ..." />;
  }

  return <AuthContent onAuthenticate={signup} />;
}

export default SignupScreen;
