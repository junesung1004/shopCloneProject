"use client"

import { googleLogin, googleLogount, onUserState } from '@/api/api'
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()
//context 컴포넌트 간에 어떤 값들을 고용할 수 있게 해주는 hook

export function AuthContextProvider({children}) {

  const [user, setUser] = useState()
  const [unSubScribe, setUnSubScribe] = useState()
  const [ isLoading, setIsLoading] = useState(true)

  useEffect(()=> {
    const storeUser = sessionStorage.getItem('user')
    if(storeUser) {
      setUser(JSON.parse(storeUser))
    }
    const userChange = (newUser) => {
      setUser(newUser)
      setIsLoading(false)

      if(newUser) {
        sessionStorage.setItem('user', JSON.stringify(newUser))
        //사용자가 로그인하면 세션스토리지에 정보를 저장
      } else {
        sessionStorage.removeItem('user')
        //로그아웃을 하면 세션 스토리지에 있는 정보를 삭제
      }

     
    }
    const unSubScribeFun = onUserState(userChange)
    //위에서 업데이트 된 사용자를 onUserState에 넘김

    setUnSubScribe(()=>unSubScribeFun)
    return()=> {
      if(unSubScribeFun) {
        unSubScribeFun()
      }
    }
  },[])

  return(
    <AuthContext.Provider value={{user, googleLogin, googleLogount, uid:user && user.uid, isLoading}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(){
  return useContext(AuthContext)
}