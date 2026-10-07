import { createContext, useState } from "react";

import RadioDialog from "../components/dialogs/RadioDialog";

export const RadioContext = createContext({
  showRadio: ({
    title,
    options,
    checkedValue,
    onChange,
    onCloseByBackButton,
    accent = false,
  }) => {},
  hideRadio: () => {},
});

function RadioContextProvider({ children }) {
  const [radio, setRadio] = useState();

  function showRadio({
    title,
    options,
    checkedValue,
    onChange,
    onCloseByBackButton,
    accent = false,
  }) {
    setRadio({
      title,
      options,
      checkedValue,
      onChange,
      onClose: onCloseByBackButton,
      accent,
    });
  }

  function hideRadio() {
    setRadio(null);
  }

  return (
    <RadioContext.Provider value={{ showRadio, hideRadio }}>
      {children}
      {radio && <RadioDialog {...radio} />}
    </RadioContext.Provider>
  );
}

export default RadioContextProvider;
