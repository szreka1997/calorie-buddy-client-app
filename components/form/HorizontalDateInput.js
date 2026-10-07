import HorizontalInputContainer from "../form/HorizontalInputContainer";
import DateInput from "../form/DateInput";
import useHorizontailDateInput from "../../hooks/UI/useHorizontailDateInput";
import useInputStyles from "../../hooks/UI/useInputStyles";

function HorizontalDateInput({
  label,
  value,
  placeholderText,
  errorMessage,
  onFocus,
  onBlur,
  onChange,
  accent = false,
}) {
  const {
    inputContainerRef,
    isTouched,
    isFocused,
    show,
    pressHandler,
    focusHandler,
    blurHandler,
    onChangeDate,
  } = useHorizontailDateInput({ onFocus, onBlur, onChange });

  const { borderColor, setBorderColor, labelColor } = useInputStyles({
    errorMessage,
    isTouched,
    isFocused,
    accent,
    shouldUse800ShadeAsBorder: true,
  });

  return (
    <>
      <HorizontalInputContainer
        ref={inputContainerRef}
        label={label}
        errorMessage={errorMessage}
        labelColor={labelColor}
        borderColor={borderColor}
        setBorderColor={setBorderColor}
        onFocus={focusHandler}
        onPress={pressHandler}
        onBlur={blurHandler}
        accent={accent}
      >
        <DateInput
          value={value}
          placeholderText={placeholderText}
          show={show}
          isTouched={isTouched}
          accent={accent}
          onChangeDate={onChangeDate}
        />
      </HorizontalInputContainer>
    </>
  );
}

export default HorizontalDateInput;
