"use client"

import { googleLogin, loginEmail } from "@/api/api"
import { useRouter } from "next/navigation"
import { useState } from "react"
import styled from "styled-components"

export default function LoginPage() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  
  const router = useRouter()

  const handleSubmitEvent = async(e)=> {
    e.preventDefault()
    setError('')

    try {
      const user = await loginEmail(email, password)
      if(user){
        router.push('/')
      } else {
        setError('이메일이나 비밀번호가 일치하지 않습니다.')
      }
    } catch(err) {
      console.error("err :", err)
      setError('로그인 실패 : 시스템 오류')
    }
  }

  const googleLoginEvent = async()=> {
    try {
      const user = await googleLogin()
      if(user) {
        router.push('/')
      } 
    } catch(err) {
      console.error("err :", err)
      setError("로그인 인증 오류가 발생했습니다.")
    }
  }

  const handleClickJoin = () => {
    router.push('/join')
  }

  return (
    <Container>
      <h2>로그인</h2>
      <form onSubmit={handleSubmitEvent}>
        <input type="email" 
        placeholder="이메일을 입력하세요"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />

        <input type="password" 
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />

        <Button>
        <button>로그인</button>
        <button type="button" onClick={googleLoginEvent}>구글 로그인</button>
        
        </Button>
        
        <div>
        <button type="button" onClick={handleClickJoin}>회원가입</button>
        </div>

        {error && <span className="errorText">{error}</span>}
      </form>
    </Container>
  )
}

const Container = styled.div`

`

const Button = styled.div`
  display:flex;
  gap:30px;
`