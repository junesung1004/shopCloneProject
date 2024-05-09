"use client"

import { getProducts } from "@/api/api";
import Product from "@/components/Product";
import { useEffect, useState } from "react";
import styled from "styled-components";

export default function ProductPage() {
  const [product, setProduct ] = useState([])

  useEffect(()=> {
    const fetchProducts = async()=> {
      try {
        const products = await getProducts()
        setProduct(products)
        //console.log("product파일 :", product)
      } catch(err) {
        console.error(err)
      }
    }
    fetchProducts()
  },[])

  return(
    <Container>
      <Product products={product} />
    </Container>
  )
}

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0px auto;
  padding:50px 0px;
`