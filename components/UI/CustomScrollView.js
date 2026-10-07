import { useImperativeHandle, useRef } from "react";
import { ScrollView } from "react-native";

import ScreenContainer from "./ScreenContainer";
import CustomKeyboardAvoidingView from "./CustomKeyboardAvoidingView";

function CustomScrollView({
  ref,
  children,
  style,
  onScroll,
  disableSafeAreaView = false,
  isAuthScreen = false,
}) {
  const scrollViewRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollTo: (...args) => scrollViewRef.current?.scrollTo(...args),
    scrollToEnd: (...args) => scrollViewRef.current?.scrollToEnd(...args),
  }));

  return (
    <ScreenContainer disableSafeAreaView={disableSafeAreaView} style={style}>
      <CustomKeyboardAvoidingView isAuthScreen={isAuthScreen}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScroll={onScroll}
        >
          {children}
        </ScrollView>
      </CustomKeyboardAvoidingView>
    </ScreenContainer>
  );
}

export default CustomScrollView;
