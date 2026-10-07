import { Controller } from "react-hook-form";

import Input from "./Input";

function ControlledInput({
  inputRef,
  name,
  control,
  rules,
  label,
  errorMessage,
  blurOnSubmit,
  enterKeyHint,
  style,
  onSubmitEditing,
  autoCapitalize = "sentences",
  secureTextEntry = false,
  isLogin = false,
  isTouched = false,
  accent = false,
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          label={label}
          value={value}
          errorMessage={errorMessage}
          isTouched={isTouched}
          isLogin={isLogin}
          accent={accent}
          onBlur={onBlur}
          onChange={onChange}
          style={style}
          textInputConfig={{
            ref: inputRef,
            blurOnSubmit,
            enterKeyHint,
            autoCapitalize,
            secureTextEntry,
            onSubmitEditing,
          }}
        />
      )}
    />
  );
}

export default ControlledInput;
