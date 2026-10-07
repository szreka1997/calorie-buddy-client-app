import { useState } from "react";

import useHorizontalInputBase from "./useHorizontalInputBase";

function useHorizontailDateInput({ onFocus, onBlur, onChange }) {
  const [show, setShow] = useState(false);

  const base = useHorizontalInputBase({ onFocus, onBlur });

  const pressHandler = () => setShow(true);

  function onChangeDate(event, selectedDate) {
    setShow(false);
    base.inputContainerRef.current?.blur?.();
    if (event.type === "dismissed") return;

    base.setIsTouched(true);
    onChange?.(selectedDate);
  }

  return {
    ...base,
    show,
    pressHandler,
    onChangeDate,
  };
}

export default useHorizontailDateInput;
