import { createContext, useState } from 'react';

const initialState = { data: null }

const DataContext = createContext(initialState);

const DataContextProvider = ({ children }) => {
  const [data, setData] = useState(initialState)

  return (
    <DataContext.Provider
      value={{
        data,
        setData
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export { DataContext, DataContextProvider }