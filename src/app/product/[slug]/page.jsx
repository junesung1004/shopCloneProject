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

  useEffect(()=> {
    getCategoryProduct(slug).then((product)=>{
      setProducts(product)
    }).catch((err)=> {
      console.error("err :", err)
    }) 
  
},[slug])
//console.log("products :", products)

return (
  <Container>
  <h1>{slug}</h1>
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