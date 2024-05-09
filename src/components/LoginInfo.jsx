import { googleLogin, googleLogount, onUserState } from '@/api/api'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function LoginInfo() {
  const [user, setUser] = useState(null) //로그인된 사용자 정보를 받아올 상태값

  const login = async()=> {
    googleLogin().then(setUser)
  }
  //console.log(user)

  const logout = async()=> {
    googleLogount().then(setUser)
  }

  useEffect(()=> {
    onUserState((user)=> {
      setUser(user)
    })
  }, [])

  return (
    <>
    {user && user.isAdmin && 
    <Link href={'/upload'} className='upload'>업로드</Link>
    }
    {user ? (
      <>
      <span>{user.displayName}</span>
      <button onClick={logout}>로그아웃</button>
      </>
    ) : (
      <button onClick={login}>로그인</button>
    )}
    </>
  )
}
