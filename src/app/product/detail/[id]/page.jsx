
"use client"

import { getProductId, googleLogin } from "@/api/api"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import styled from "styled-components"
import { formatCurrency } from "@/utils/formatCurrency"
import { useAuthContext } from "@/app/context/authContext"
import useCart from "@/service/useCart"

export default function ProductDetailPage(){
  const {addItemCart} = useCart()

  const {user} = useAuthContext()
  console.log("user :", user)

  const pathName = usePathname() // 현재 주소의 경로를 받아옴
  //console.log(pathName)
  const id = pathName.split('/').pop()
  //console.log('id : ', id)

  const [product, setProduct] = useState(null)

  const [selected, setSelected] = useState()
  const [selectedColor, setSelectedColor] = useState()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=> {

    if(!id) {
      setError('제품 정보를 찾을 수 없습니다.')
      setIsLoading(false)
      return
    }
    const fetchData = async () => {
      try{
        const data = await getProductId(id)
        //console.log("data :", data)
        if(data) {
          setProduct(data)
        } else {
          setError(false)
        }
      } catch(err) {
        console.error("err :", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  },[id])

  const selectOpt = (e) => {
    console.log("selected:", selected)
    setSelected(e.target.value)
    
  }

  const selectColor = (color) => {
    console.log(color)
    setSelectedColor(color)
  }

  const handleActionClick = (type) => {
    if(!user) {
      alert('로그인이 필요합니다.')
      googleLogin()
    } 

    const {image, title, price} = product;
    const itemAddOption = {
      id,
      image,
      title,
      price,
      option : selected,
      color : selectColor,
      quantity : 1, // 수량
    }
    
  }

  addItemCart(itemAddOption)

  
  if(isLoading) return <p>로딩중입니다.</p>
  if(error) return <p>{error}</p>
  if(!product) return <p>제품이 없습니다.</p>


  return(
    <DetailPage>
      <div className="detailImg">
        <Image src={product.image} width={300} height={300} layout="responsive" alt={product.title}/>
      </div>
      <div className="detailTextWrap">
        <h3>{product.title}</h3>
        <p className="price">가격 : <span>{formatCurrency(product.price)}원</span></p>

        <div className="detailOpt">
          <label className="labelText" htmlFor="optSelect">옵션</label>
          {/* 리액트에서는 label에서 for 대신 htmlFor로 사용 */}
          <select id="optSelect" value={selected} onChange={selectOpt}>
            {product?.option?.split(',').map((opt, idx)=> (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="detailColors">
          <p>색상 선택</p>
          {product?.colors?.map((opt, idx)=> (
            <div className="colorChip" 
            key={idx} style={{backgroundColor : opt}} 
            onClick={()=>selectColor(opt)}/>
          ))}
        </div>

        <div className="detailBtns">
          <button className="cartBtn" onClick={()=>handleActionClick('장바구니 담기')}>장바구니 담기</button>
          <button className="buyBtn" onClick={()=>handleActionClick('구매하기')}>구매하기</button>
        </div>
      </div>
    </DetailPage>
  )
}

const DetailPage = styled.div`
  max-width: 1200px;
  margin: 0px auto;
  padding: 30px 0px;
  display: flex;
  justify-content: center;
  gap: 40px;
  .detailImg {
    max-width: 400px;
    width: 100%;
    
    img {
      display: block;
      width: 100%;
    }
  }
  .detailTextWrap {
    display: flex;
    flex-direction: column;
    gap:20px;
    width:100%;
    max-width: 400px;
    h3{
      font-size: 24px;
      color: #000;
      font-weight: normal;
      border-bottom : 1px solid rgba(0,0,0,0.3);
      padding-bottom : 20px;
      margin-bottom: 100px;
    }
    .price {
      display: flex;
      align-items: center;
      gap: 30px;
      color : rgba(0,0,0,0.6);
      span {
        color :rgba(0,0,0,1);
      }
    }
    .detailOpt {
      display: flex;
      gap: 30px;
      align-items: center;
      select {
        width: 80%;
        padding: 6px;
        background-color: transparent;
        option {
          background-color : black
        }
      }
    }
    .detailColors{
      display: flex;
      gap: 8px;
      height: 20px;
      .colorChip {
        width: 20px;
      }
    }
    .detailBtns{
      margin-top: 50px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      button {
        width:100%;
        height: 44px;
        display:flex;
        justify-content: center;
        align-items:center;
        border-radius: 4px;
        cursor: pointer;
        border: none;
        background: transparent;
        font-weight: bold;
        &.cartBtn {
          background: lightblue
        }
        &.buyBtn {
          background : #000;
          color: #fff;
        }
      }
    }
  }
`