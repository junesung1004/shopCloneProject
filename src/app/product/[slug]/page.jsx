"use client"

import { getCategoryProduct } from "@/api/api";
import CategoryProductList from "@/components/CategoryProductList";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import NoProduct from "./NoProduct";
// import { useRouter } from "next/router";

export default function CategoryPage() {
  const pathName = usePathname();
  //console.log(pathName)
  const slug = pathName.split('/').pop();
  //console.log("slug: ", slug)

  const [products, setProducts] = useState([])
  const [randomImages, setRandomImages] = useState([])

  useEffect(()=> {
    getCategoryProduct(slug).then((product)=>{
      setProducts(product)
    }).catch((err)=> {
      console.error("err :", err)
    }) 
  
},[slug])
//console.log("products :", products)

// useEffect(()=> {
//   if(products.length > 0) {
//     const randomImg = [...products].sort(()=>0.5 - Math.random())
//     console.log("randomImg :", randomImg)
//     //.sort(()=>0.5 - Math.random() 랜덤 정렬을 위한 로직
//     //sort()=> 배열 정렬하기
//     const selectImg = randomImg.slice(0,4).map((el)=>el.img)
//     setRandomImages(selectImg)
//   }
// },[products])

return (
  <Container>
  <h1>{slug}페이지</h1>
  {/* <CategoryPage imgs={randomImages} /> */}
  {/* <CategoryProductList slug={slug} products={products}/> */}
  {products.length > 0 ? (
    <CategoryProductList slug={slug} products={products}/>
  ) : (
    <NoProduct />
  )}
  </Container>
)
}

const Container = styled.div`
  
`