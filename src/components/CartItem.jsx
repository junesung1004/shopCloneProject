import { removeCart } from "@/api/api";
import useCart from "@/service/useCart";
import { formatCurrency } from "@/utils/formatCurrency"
import Image from "next/image"
import { MdArrowDownward } from "react-icons/md";
import { MdArrowUpward } from "react-icons/md";
import styled from "styled-components";

export default function CartItem({product, idx}){

  const{addItemCart , removeItemCart} = useCart()
  console.log("removeItemCart :", removeItemCart)

  const plusQuantity = () => {
    addItemCart.mutate({...product, quantity : product.quantity +1})
  }

  const minusQuantity = () => {
    if(product.quantity < 2) {
      alert('상품 갯수는 1보다 작을 수 없습니다.')
      return
    }
    addItemCart.mutate({...product, quantity : product.quantity -1})
  }

  const itemDelete = () => {
    removeItemCart.mutate(product.id)
  }


  
  
  return (
    <>
    <li>
      <Container>
      <p>{idx}</p>
      <img src={product.image} alt={product.title}  />
      <p className="cartItemTitle">상품명 : {product.title}</p>
      <p className="cartItemOpt">옵션 :{product.option}</p>
      <div className="cartItemColor">
        <p>컬러 :</p><span style={{backgroundColor : product.color}}></span>
      </div>
      <p className="cartItemPrice">가격 : {formatCurrency(product.price)}원</p>
      <div className="cartItemQu">
        <p>수량 : {product.quantity}개</p>
        <button onClick={plusQuantity}><MdArrowUpward /></button>
        <button onClick={minusQuantity}><MdArrowDownward /></button>
      </div>
      <div>
      <button className="removeBtn" onClick={()=>itemDelete(product.id)}>삭제</button>
      </div>
      
    
      </Container>
      </li>
    </>
  )
}

const Container = styled.div`
  display: flex;
  gap: 20px;

`