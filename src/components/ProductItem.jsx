import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { formatCurrency } from '@/utils/formatCurrency'
import { useRouter } from 'next/navigation'//router 관련 기능은 next/router에서 next/navigation으로 바뀜

export default function ProductItem({product}) {

  //console.log("productItem :", product)

  const router = useRouter()

  const detailNavigate = () => {
    router.push(`/product/detail/${product.id}`)
    /*
    nextjs에서 router기능중에서 페이지 이동 방법
    push()  : url이동 -> 히스토리 저장 (뒤로가기 버튼시 이전 url로 이동 가능)
    replace()  : url이동 -> 히스토리에 저장하지 않음( 즉 뒤로가기 동작시 이전 url로 가지 않음)
    go()  :  숫자만큼 뒤로 가거나 앞으로 가기가 가능
    ex) .go(2)  --> 2단계 앞으로 이동, .go(-2) 2단계 뒤로 이동
    */
  }

  return (
    <DetailItem onClick={detailNavigate}>
      <img src={product.image}  alt={product.title}/>
      <TextWrap>
        <h3 className='itemTitle'>{product.title}</h3>
        <div className='itemFlex'>
          <p className='itemPrice'>{formatCurrency(product.price)}원</p>
          <p className='itemOpt'>{product.option}</p>
        </div>
        <div className='itemColor'>
          {product.colors && product.colors.map((color,idx)=> (
            <div key={idx} style={{backgroundColor : color}}/>
          ))}
        </div>
      </TextWrap>
    </DetailItem>
  )
}

//Image 컴포넌트를 사용할때에는 허용된 이미지 소스 도메인만 사용할 수 있다.

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const TextWrap = styled.div`
  display:flex;
  flex-direction: column;
  gap: 12px;
  .itemTitle {
    font-size: 20px;
    font-weight : bold;
    transition : 500ms;
    color : rgba(0,0,0,0.5);
    &:hover {
      color : rgba(0,0,0,1);
    }
  }
  .itemFlex {
    display: flex;
    justify-content: space-between;
  }
  .itemColor {
    display: flex;
    height: 20px;
    gap: 4px;
    div {
    width: 20px;
    height: 20px;
    border: 1px solid rgba(255,255,255,0.5);
    }
  }
  .itemOpt {
    display : flex;
    flex-direction: column;
  }
`