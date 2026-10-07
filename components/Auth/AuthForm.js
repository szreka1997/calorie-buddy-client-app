import { StyleSheet, View } from "react-native";

import OutlinedButton from "../UI/custom-buttons/OutlinedButton";
import ControlledInput from "../form/ControlledInput";
import useCustomForm from "../../hooks/useCustomForm";
import { getAuthFormFieldsConfig } from "../../utils/authUtils";

function AuthForm({ isLogin, inputRefs, inputSubmitHandler, onSubmit }) {
  const { handleSubmit, methods } = useCustomForm({
    onSubmit,
    errorTitle: `${isLogin ? "Login" : "Registration"} Error!`,
    errorMessage: isLogin
      ? "Invalid email or password. Please try again!"
      : undefined,
    accent: !isLogin,
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const { control, formState } = methods;
  const { errors, touchedFields } = formState;

  return (
    <View>
      {/* INPUTS */}
      <View>
        {getAuthFormFieldsConfig(isLogin).map((field, index, array) => {
          const isLastItem = index === array.length - 1;

          return (
            <ControlledInput
              key={field.name}
              name={field.name}
              control={control}
              rules={field.rules}
              label={field.label}
              accent={isLogin}
              isLogin={isLogin}
              errorMessage={errors[field.name]?.message}
              isTouched={touchedFields[field.name]}
              style={styles.inputs}
              inputRef={inputRefs[field.name]}
              blurOnSubmit={isLastItem}
              enterKeyHint={isLastItem ? "done" : "next"}
              onSubmitEditing={
                isLastItem
                  ? handleSubmit
                  : () => inputSubmitHandler(inputRefs[array[index + 1].name])
              }
              secureTextEntry={field.name === "password"}
              autoCapitalize={
                (field.name === "email" || field.name === "password") && "none"
              }
            />
          );
        })}
      </View>

      {/* AUTHORIZE BUTTON */}
      <View>
        <OutlinedButton
          accent={isLogin}
          style={styles.button}
          onPress={handleSubmit}
        >
          {isLogin ? "Log In" : "Sign Up"}
        </OutlinedButton>
      </View>
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  inputs: {
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
  },
});
