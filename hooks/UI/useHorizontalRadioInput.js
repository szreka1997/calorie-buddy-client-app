import { useContext } from "react";

import useHorizontalInputBase from "./useHorizontalInputBase";
import { RadioContext } from "../../contexts/radio-context";

function useHorizontalRadioInput({
  label,
  value,
  radioConfig,
  onFocus,
  onBlur,
  onChange,
  accent = false,
}) {
  const base = useHorizontalInputBase({ onFocus, onBlur });
  const radioCtx = useContext(RadioContext);

  function pressHandler() {
    radioCtx.showRadio({
      title: label,
      options: radioConfig.options,
      checkedValue: value,
      accent,
      onChange: radioChangeHandler,
      onCloseByBackButton: radioCloseHandler,
    });
  }

  function radioChangeHandler(value) {
    radioCloseHandler();
    onChange(value);
  }

  function radioCloseHandler() {
    radioCtx.hideRadio();
    base.inputContainerRef.current.blur();
  }

  return {
    ...base,
    pressHandler,
  };
}

export default useHorizontalRadioInput;
