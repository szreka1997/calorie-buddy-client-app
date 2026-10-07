import { Controller } from "react-hook-form";

import HorizontalDateInput from "./HorizontalDateInput";

function RenderHorizontalDateInput({
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
        <HorizontalDateInput
          label={fieldConfig.label}
          placeholderText={fieldConfig.placeholderText}
          value={value}
          errorMessage={formState.errors[fieldConfig.name]?.message}
          accent={accent}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
        />
      )}
    />
  );
}

export default RenderHorizontalDateInput;
