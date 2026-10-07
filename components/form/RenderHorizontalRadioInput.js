import { Controller } from "react-hook-form";

import HorizontalRadioInput from "./HorizontalRadioInput";

function RenderHorizontalRadioInput({
  formState,
  control,
  fieldConfig,
  onFocus,
  accent = false,
}) {
  return (
    <Controller
      name={fieldConfig.name}
      control={control}
      rules={fieldConfig.rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <HorizontalRadioInput
          label={fieldConfig.label}
          placeholderText={fieldConfig.placeholderText}
          value={value}
          radioConfig={fieldConfig.radioConfig}
          errorMessage={formState.errors[fieldConfig.name]?.message}
          isTouched={formState.touchedFields[fieldConfig.name]}
          accent={accent}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
        />
      )}
    />
  );
}

export default RenderHorizontalRadioInput;
