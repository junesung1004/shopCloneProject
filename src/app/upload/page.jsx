
"use client"
import { addProducts, uploadImages } from "@/api/api";
import { categoryContext } from "@/utils/categoryContext";
import { useContext, useRef, useState } from "react";
import styled from "styled-components";

export default function UploadPage() {
  /*
  파이어베이스 데이터베이스 이용시 주의사항
  데이터베이스는 키와 값으로만 이루어진 객체 json방식으로 저장
  이미지는 db에 저장할 수 없다.
  이미지를 저장할 수 있는 클라우드(firebase storage, cloudinary)를 사용해서 이미지를 따로 저장한 후에 이미지 경로만 받아서
  db에 주소만 저장하는 방식을 이용해야 한다.

  */

  const color = [
    '#f6d365', '#000000', '#a1c4fd', '#dddddd', '#4facfe',
    '#30cfd0', '#764ba2', '#c471f5', '#3cba92', '#ffb199'
  ]

  const [product, setProduct] = useState({
    title : '',
    price : '',
    option : '',
    category : '',
    colors : [],
  })

  //이미지 미리보기
  const [file, setFile] = useState(null)
  const {categoryList} = useContext(categoryContext)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const fileRef = useRef()// 업로드하는 파일의 입력해져있는 값을 비울때는 REF를 사용한다.

  //작성 결과 미리보기
  const productInfoChange = (e) => {
    const {name, value, files} = e.target
    if(name === 'file' && files && files[0]) {
      setFile(files[0])
    } else {
      setProduct((prev)=>({...prev, [name]:value}))
    }
  }
    /*
    name을 []로 묶는 이유 계산된 속성명을 사용하기 위해서 사용
    변수의 값을 객체의 키로 동적으로 설정할 수 있게 됨
    입력 폼에서 여러개의 입력창을 수정해야 하기 때문에 하나의 입력창을 수정할때마다 그 선택자를
    동적으로 받아와서 값을 받아옴
    []로 묶지 않으면 하나의 값으로만 인식해서 입력값을 제대로 받아오지 못하게 됨

    []x = 변수 이름이 아니라 문자열의 키값으로 사용
    [] = 변수의 값이 동적으로 계산되어 사용

    */
  

  //colorpicker event
  const colorPicker = (color) => {
    setProduct((prev)=>({
      ...prev, colors: prev.colors.includes(color) ? prev.colors : [...prev.colors, color]
      //includes : 문자열이 다른 문자열에 포함되어 있는지 확인하는 메서드
    }))
  }

  //폼 업로드 
  //업로드에는 두 가지 이벤트가 실행
  //1. 이미지는 스토리지에 저장(저장된 경로만 추출)
  //2. 스토리지에 저장된 이미지의 경로는 데이터베이스에 같이 경로만 저장
  //3. 나머지는 데이터베이스에 저장
  
  //이미지 관련 api
  const uploadSubmit = async(e) => {
    e.preventDefault();
    try{
      // 1. 이미지는 스토리지에 저장(저장된 경로만 추출)
      const url = await uploadImages(file)
      // console.log("url:", url)
      await addProducts(product, url)
      setSuccess('업로드가 완료되었습니다.')

      setTimeout(() => {
        setSuccess(null)
      }, 2000);

      setFile(null)
      setProduct({
        title : '',
        price : '',
        option : '',
        category : '',
        colors : [],
      })

      if(fileRef.current) {
        fileRef.current.value = ''
      }
    } catch(err) {
      console.error("err :", err)
      setError('업로드에 실패했습니다.')
    } finally {
      setIsLoading(false)
      //finally : try와 catch와 관계없이 try와 catch가 실행되고 무조건적으로실행되는 블록
    }
  }


  return(
    <UploadContainer>
      <div className="imgUploadWrap">
        {file && (
          <img src={URL.createObjectURL(file)} alt="uploadImg" />
        )}
      </div>
      <form onSubmit={uploadSubmit} >
        {/* submit 이벤트는 form태그에서 일어난다. */}

        {/* 이미지 업로드 */}
        <input 
        type="file" 
        name="file"
        accept="image/*"
        onChange={productInfoChange}
        // ref={fileRef}
        />

        {/* 타이틀 업로드 */}
        <input type="text" 
        name="title" 
        placeholder="상품명을 입력하세요" 
        value={product.title}
        onChange={productInfoChange}
        />

        {/* 가격 업로드 */}
        <input type="text" 
        name="price"
        placeholder="가격을 입력하세요"
        value={product.price}
        onChange={productInfoChange}
        />

        {/* 카테고리 선택창 */}
        <select name="category" 
        value={product.category}
        onChange={productInfoChange}
        >
          <option value="">분류선택</option>
          {categoryList.map((el,idx)=> (
            <option key={idx} value={el}>{el}</option>
          ))}
        </select>

        {/* 옵션 업로드 */}
        <input type="text" 
        name="option"
        placeholder="상품 옵션을 ,로 구분해서 입력해주세요"
        value={product.option}
        onChange={productInfoChange}
        />

        {/* 색상 업로드 */}
        <ColorChip>
          {color.map((color,idx)=> (
            <div className="colorChipItem" key={idx} style={{backgroundColor : color}} 
            onClick={()=>colorPicker(color)}
            />
          ))}
        </ColorChip>

        <ColorSelect>
        {product.colors.map((color, idx)=> (
          <div key={idx} style={{backgroundColor : color}}>{color}</div>
        ))}
        </ColorSelect>

        {/* 업로드 버튼 */}
        <button className="resultBtn"
        disabled={isLoading}
        >{isLoading ? '업로드중' : '제품 등록하기'}
        </button>
        {success && (<p>{success}</p>)}
        {error && (<p>{error}</p>)}
      </form>
    </UploadContainer>
  )
}

const UploadContainer = styled.div`
  max-width: 1200px;
  padding: 30px 0px;
  margin: 0px auto;
  gap: 40px;
  display: flex;
  .imgUploadWrap {
    max-width: 500px;
    height: auto;
    img {
      display: block;
      width: 100%;
      height: 386px;
    }
  }
  form {
    width: 100%;
    display:flex;
    flex-direction:column;
    gap:24px;
    input {
      width: 100%;
      box-sizing: border-box;
      height: 40px;
      border-radius: 4px;
      border-color:rgba(0,0,0,0.2);
      padding : 12px 24px;
    }
  }
`

const ColorChip = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  .colorChipItem {
    width: 20px;
    height: 20px;
  }
`

const ColorSelect = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  div {
    width: 100px;
    height: 30px;
    color : #ffffff;
    border: 1px solid rgba(0,0,0,0.6);
    border-radius:2px;
    display:flex;
    justify-content: center;
    align-items: center;
  }

`