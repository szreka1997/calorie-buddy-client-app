import { Controller } from "react-hook-form";

import HorizontalTextInput from "./HorizontalTextInput";

function RenderHorizontailTextInput({
  ref,
  formState,
  control,
  fieldConfig,
  enterKeyHint,
  submitBehavior,
  onSubmitEditing,
  accent = false,
  isNumeric = false,
}) {
  return (
    <Controller
      name={fieldConfig.name}
      control={control}
      rules={fieldConfig.rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <HorizontalTextInput
          ref={ref}
          label={fieldConfig.label}
          placeholderText={fieldConfig.placeholderText}
          value={value}
          errorMessage={formState.errors[fieldConfig.name]?.message}
          isTouched={formState.touchedFields[fieldConfig.name]}
          accent={accent}
          enterKeyHint={enterKeyHint}
          submitBehavior={submitBehavior}
          textInputConfig={
            isNumeric
              ? {
                  keyboardType: "number-pad",
                  inputMode: "numeric",
                  maxLength: 5,
                }
              : {
                  maxLength: 50,
                }
          }
          onChange={onChange}
          onBlur={onBlur}
          onSubmitEditing={onSubmitEditing}
        />
      )}
    />
  );
}

export default RenderHorizontailTextInput;
