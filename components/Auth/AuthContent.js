import { useRef } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import CustomScrollView from "../UI/CustomScrollView";
import FlatButton from "../UI/custom-buttons/FlatButton";
import AuthForm from "./AuthForm";
import useFormScrollAndBlur from "../../hooks/UI/useFormScrollAndBlur";
import { getNextAuthRouteName } from "../../utils/authUtils";

function AuthContent({ onAuthenticate, isLogin = false }) {
  const inputRefs = {
    username: useRef(null),
    firstName: useRef(null),
    lastName: useRef(null),
    email: useRef(null),
    password: useRef(null),
  };
  const navigation = useNavigation();

  function switchAuthModeHandler() {
    navigation.replace(getNextAuthRouteName(isLogin));
  }

  const { scrollViewRef, scrollHandle, inputSubmitHandler } =
    useFormScrollAndBlur(inputRefs);

  return (
    <CustomScrollView ref={scrollViewRef} onScroll={scrollHandle} isAuthScreen>
      <View>
        {/* AUTH FORM */}
        <AuthForm
          isLogin={isLogin}
          inputRefs={inputRefs}
          inputSubmitHandler={inputSubmitHandler}
          onSubmit={onAuthenticate}
        />

        {/* SWITCH BUTTON */}
        <View>
          <FlatButton accent={!isLogin} onPress={switchAuthModeHandler}>
            {isLogin ? "Create a new user" : "Log in instead"}
          </FlatButton>
        </View>
      </View>
    </CustomScrollView>
  );
}

export default AuthContent;
