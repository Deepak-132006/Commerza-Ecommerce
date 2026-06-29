import React, { createContext, useState } from 'react'

export const AuthContext = createContext()
export function AuthProvider({children}){
    const [isLogged, setIsLogged] = useState(
        !!localStorage.getItem("accessToken")
    )
  return (
    <AuthContext.Provider value={{isLogged, setIsLogged}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider