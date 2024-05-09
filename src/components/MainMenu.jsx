import { categoryContext } from '@/utils/categoryContext'
import Link from 'next/link'
import React, { useContext } from 'react'
import styled from 'styled-components'

export default function MainMenu() {
  const {categoryList} = useContext(categoryContext)
  return (
    <Nav>
      <ul>
        {categoryList.map((el, idx)=>(
          <li key={idx}>
            <Link href={`/product/${el}`}>{el}</Link>
          </li>
        ))}
      </ul>
    </Nav>
  )
}


const Nav = styled.nav`
  
`