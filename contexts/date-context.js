import { createContext, useState } from "react";

export const DateContext = createContext({
  date: null,
  setDate: (newDate) => {},
});

function DateContextProvider({ children }) {
  const [date, setDate] = useState(new Date());

  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  );
}

export default DateContextProvider;
