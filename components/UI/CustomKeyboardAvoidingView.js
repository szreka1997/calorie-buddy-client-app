import { useState, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  StyleSheet,
} from "react-native";

function CustomKeyboardAvoidingView({ children, isAuthScreen = false }) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setIsKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setIsKeyboardVisible(false),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={isAuthScreen ? 90 : isKeyboardVisible ? -900 : 90}
      style={styles.screen}
    >
      <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
        {children}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default CustomKeyboardAvoidingView;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
