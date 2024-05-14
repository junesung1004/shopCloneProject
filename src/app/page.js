"use client"

import Image from "next/image";
import styles from "./page.module.css";
import ProductPage from "./product/page";
import MainCategoryList from "@/components/MainCategoryList";
import styled from "styled-components";

export default function Home() {
  return (
    <Container>
      {/* 전체목록 페이지 */}
      <ProductPage />

      {/* 카테고리별 리스트 보여주는 목록 */}
      <MainCategoryList category={'top'} />
      <MainCategoryList category={'bottom'} />
      <MainCategoryList category={'outer'} />
      <MainCategoryList category={'accessory'} />
    </Container>
  );
}


const Container = styled.div`
display:flex;
flex-wrap:wrap;
flex-direction: column;
`