import {createContext, useState} from 'react'



export const  UserLoginContext = createContext();

// const token = localStorage.getItem('token')
export function UserProvider({children}){
    const [user,setUser] = useState(null)
    
    return (
        <UserLoginContext.Provider value={{user,setUser}}>{children}</UserLoginContext.Provider>
    )
}


export default UserLoginContext