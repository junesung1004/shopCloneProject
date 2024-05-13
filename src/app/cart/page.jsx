
"use client"
import CartItem from "@/components/CartItem";
import useCart from "@/service/useCart";
import styled from "styled-components";



export default function CartPage() {
  const {cartInfo : {data : products}} = useCart()
  const isItem = products && products.length > 0;
  console.log("isItem : ", isItem);
  return(
    <Container>
      <h2 className="itemTitle">장바구니 리스트</h2>
      {!isItem && <p>장바구니에 상품이 없습니다.</p>}
      
      {isItem && (
        <CartList>
          {products && products.map((el, idx)=> (
            <CartItem key={el.id} product={el} index={idx} />
          ))}
        </CartList>
      )}
    </Container>
  )
}


const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0px auto;
  padding: 100px 0px;
  .itemTitle {
    font-size: 40px;
    font-weight:bold;
    margin-bottom: 24px;
  }
`

const CartList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-top : 1px solid rgba(0,0,0,0.3);
  li {
    display: flex;
    align-items:center;
    justify-content: center;
    gap:20px;
  }
`