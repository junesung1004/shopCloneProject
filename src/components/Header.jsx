"use client"

import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import LoginInfo from './LoginInfo'
import MainMenu from './MainMenu'

export default function Header() {
  return (
    <HeaderContainer>
    <h1 className='logo'>
      <Link href={'/'}>shop</Link>
      
    </h1>
    <MainMenu />
    <LoginInfo />
    </HeaderContainer>
  )
}

const HeaderContainer = styled.header`
  width: 100%;
  padding: 12px 24px;
  box-sizing: border-box;
  border-bottom: solid 1px gray;
  display: flex;
  justify-content: space-between;
`