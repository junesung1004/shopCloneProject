import {initializeApp} from 'firebase/app'
import {GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut} from 'firebase/auth'
import {getDatabase, ref as databaseRef, set, get, query, orderByChild, equalTo} from 'firebase/database'
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes} from 'firebase/storage';
import { adminUser } from '@/service/admin';
import {v4 as uuid} from 'uuid'

//yarn add uuid   : 생성을할때 고유 id값을 넣어준다.

//firebaseConfig : firebase 프로젝트 설정 값 객체 api키, 도메인 인증, 데이터베이스 키값.. -> env 파일에 변수로 저장하여 활용
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL : process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
  storageBucket : process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); //firebaseConfig를 기반으로 firebase설정 초기값을 초기화
const auth = getAuth(app); // 초기화된 앱을 기반으로 firebase인증 객체 생성(사용자 인증 관리)
const provider = new GoogleAuthProvider() //google로그인 기능을 사용할때 추가하는 프로바이더 객체 생성
const database = getDatabase() // 초기화된 앱을 기반으로 firebase 데이터베이스 객체 생성
const storage = getStorage();

console.log(firebaseConfig)


//구글 자동 로그인 방지
provider.setCustomParameters({
  //setCustomParameters : 인증 요청에 대한 사용자 정의 파라미터값을 설정하는 메서드
  prompt : 'select_account'
})

//구글 로그인
export async function googleLogin(){
  try {
    //signInWithPopup : firebase 자체에 있는 인증 객체 provier를 인자로 받아서 google계정을 연동해서 로그인 할 수 있게 하는 메서드
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    console.log(user)
    return user;
  } catch(err) {
    console.log("err :", err)
  }
}

//구글 로그아웃
export async function googleLogount(){
  try {
    await signOut(auth)
  } catch(err) {
    console.log("err : ", err)
  }
}

//로그인 유지(새로고침 해도 로그인 유지)
export function onUserState(callback) {
  //onAuthStateChanged = 사용자 인증 상태 변화 체크하는 파이어베이스 훅
  onAuthStateChanged(auth, async(user)=> {
    if(user){
      try{
        const updateUser = await adminUser(user)
        callback(updateUser)
      } catch(err) {
        console.log("err :", err)
        callback(user)
      }
    } else {
      callback(null)
    }
  })
}

//이미지 파이어베이스 스토리지에 등록
export async function uploadImages(file){
  try{
    const id = uuid();
    const imgRef = storageRef(storage, `images/${id}`)
    console.log(imgRef)
    console.log(id)
    await uploadBytes(imgRef, file)
    const imgUrl = await getDownloadURL(imgRef)
    return imgUrl
  } catch(err) {
    console.error("err :", err)
  }
}

//이미지 링크와 함께 상품을 데이터베이스에 등록
export async function addProducts(product, imgUrl) {
  try {
    const id = uuid();
    console.log("id",id)
    await set(databaseRef(database, `products/${id}`),{
      ...product,
      id,
      image : imgUrl,
      price : parseInt(product.price)
    })
    console.log("set",set)
  } catch(err) {
    console.error("err :", err)
  }
}

//데이터베이스에 등록된 상품 리스트를 가져오기(html에 뿌려주는 코드)
export async function getProducts(){
 
  // const snapshot = await get(databaseRef(database, 'products'))
  // if(snapshot.exists()){
  //   return Object.values(snapshot.val())
  // } else {
  //   return []
  // }

  try {
    const snapshot = await get(databaseRef(database, 'products'))
    console.log("snapshot :", snapshot)
    if(snapshot.exists()){
      console.log(Object.values(snapshot.val()))
      return Object.values(snapshot.val())
    } else {
      return []
    }
  } catch(err) {
    console.error("err :", err)
    return []
  }

}

// 카테고리별로 아이템을 구분해서 출력 : 클라이언트 필터링 버전.
// 데이터의 양이 작을때에는 상관없지만 데이터의 양이 많을 경우에는 클라이언트 필터링이 불리해지는 부분이 생김
/*
모든 데이터를 클라이언트로 전송하는 로직이기 때문에 클라이언트 자체의 메모리 처리에있어
과부하의 문제가 생김
데이터의 전송량 문제 : 데이터가 클 수록 네트워크 데이터 사용량이 증가

해결 방법 : 서버측 필터링으로 대체
-api서버 자체에서 필터링을 거친 후 결과값만 클라이언트로 전송되기 때문에 데이터의 속도나 사용량에 차이가 많이 생김
데이터 양이 클수록 클라이언트 필터링보다는 서버 필터링을 추천
*/
// export async function getCategoryProduct(category) {
//   try {
//     return get(databaseRef(database, 'products')).then((snapshot)=>{
//       if(snapshot.exists()){
//         const allProduct = Object.values(snapshot.val())
//         const filterProduct = allProduct.filter((product)=> product.category === category)
//         return filterProduct
//       } else {
//         return []
//       }
//     })
//   } catch(err) {
//     console.error("err : ", err)
//   }
// }

//서버 필터링 버전
export async function getCategoryProduct(category) {
  try {
    const productRef = databaseRef(database, 'products')

    //category를 기준으로 쿼리를 생성하고 필드에 주어진 값이 전송받은 catagory와 같은 값만 조회
    const q = query(productRef, orderByChild('category'), equalTo(category))
    console.log("q : ", q)
    const snapshot = await get(q)
    if(snapshot.exists()){
      return Object.values(snapshot.val())
    } else {
      return []
    }
    //console.log("snapshot :", snapshot)
  } catch(err) {
    console.error("err :", err)
    return []
  }
}


export {database}