import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref as databaseRef, set, get, query, orderByChild, equalTo, remove } from "firebase/database";
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { adminUser } from "@/service/admin";
import { v4 as uuid } from "uuid";

//yarn add uuid   : 생성을할때 고유 id값을 넣어준다.

//firebaseConfig : firebase 프로젝트 설정 값 객체 api키, 도메인 인증, 데이터베이스 키값.. -> env 파일에 변수로 저장하여 활용
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); //firebaseConfig를 기반으로 firebase설정 초기값을 초기화
const auth = getAuth(app); // 초기화된 앱을 기반으로 firebase인증 객체 생성(사용자 인증 관리)
const provider = new GoogleAuthProvider(); //google로그인 기능을 사용할때 추가하는 프로바이더 객체 생성
const database = getDatabase(); // 초기화된 앱을 기반으로 firebase 데이터베이스 객체 생성
const storage = getStorage();

//console.log(firebaseConfig)

//구글 자동 로그인 방지
provider.setCustomParameters({
  //setCustomParameters : 인증 요청에 대한 사용자 정의 파라미터값을 설정하는 메서드
  prompt: "select_account",
});

//구글 로그인
export async function googleLogin() {
  try {
    //signInWithPopup : firebase 자체에 있는 인증 객체 provier를 인자로 받아서 google계정을 연동해서 로그인 할 수 있게 하는 메서드
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log(user);
    return user;
  } catch (err) {
    console.log("err :", err);
  }
}

//구글 로그아웃
export async function googleLogount() {
  try {
    await signOut(auth);
  } catch (err) {
    console.log("err : ", err);
  }
}

//로그인 유지(새로고침 해도 로그인 유지)
export function onUserState(callback) {
  //onAuthStateChanged = 사용자 인증 상태 변화 체크하는 파이어베이스 훅
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const updateUser = await adminUser(user);
        callback(updateUser);
      } catch (err) {
        console.log("err :", err);
        callback(user);
      }
    } else {
      callback(null);
    }
  });
}

//이미지 파이어베이스 스토리지에 등록
export async function uploadImages(file) {
  try {
    const id = uuid();
    const imgRef = storageRef(storage, `images/${id}`);
    console.log(imgRef);
    console.log(id);
    await uploadBytes(imgRef, file);
    const imgUrl = await getDownloadURL(imgRef);
    return imgUrl;
  } catch (err) {
    console.error("err :", err);
  }
}

//이미지 링크와 함께 상품을 데이터베이스에 등록
export async function addProducts(product, imgUrl) {
  try {
    const id = uuid();
    console.log("id", id);
    await set(databaseRef(database, `products/${id}`), {
      ...product,
      id,
      image: imgUrl,
      price: parseInt(product.price),
    });
    console.log("set", set);
  } catch (err) {
    console.error("err :", err);
  }
}

//데이터베이스에 등록된 상품 리스트를 가져오기(html에 뿌려주는 코드)
export async function getProducts() {
  // const snapshot = await get(databaseRef(database, 'products'))
  // if(snapshot.exists()){
  //   return Object.values(snapshot.val())
  // } else {
  //   return []
  // }

  try {
    const snapshot = await get(databaseRef(database, "products"));
    console.log("snapshot :", snapshot);
    if (snapshot.exists()) {
      console.log(Object.values(snapshot.val()));
      return Object.values(snapshot.val());
    } else {
      return [];
    }
  } catch (err) {
    console.error("err :", err);
    return [];
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
// get메서드로 데이터베이스에 있는 모든 데이터를 가져옴
//       if(snapshot.exists()){
//         const allProduct = Object.values(snapshot.val())
//가져온 데이터를 값들로 변환해서 배열로 반환
//         const filterProduct = allProduct.filter((product)=> product.category === category)
// 배열에서 주어진 특정한 카테고리와 일치하는 항목으로 필터링
//         return filterProduct
//       } else {
//         return []
//       }
//     })
//   } catch(err) {
//     console.error("err : ", err)
//   }
// }

/*
  필터링시 클라이언트 버전과 서버 버잔 차이
  클라이언트
  -모든 데이터를 클라이언트로 먼저 가져온 후 필터링
  -데이터의 양이 많아질수록 클라이언트에서 사용하는 메모리 양이 증가(네트워크 사용량 증가, 메모리 사용량 증가) = 과부하 원인

  서버
  -서버에서 필터링된 데이터만 간추려서 클라이언트로 전송
  -데이터의 필요한 정보만 넘어오기 때문에 사용자 속도 증가, 클라이언트 측 메모리 감소, 네트워크 사용량 감소
*/

//서버 필터링 버전
export async function getCategoryProduct(category) {
  try {
    const productRef = databaseRef(database, "products");
    //데이터베이스 안에 있는 products 폴더를 참조해서 변수에 저장
    //데이터베이스에 있는 products의 경로를 참조

    //category를 기준으로 쿼리를 생성하고 필드에 주어진 값이 전송받은 catagory와 같은 값만 조회
    //즉 주어진 productRef 참조 경로안에서 쿼리 조건문을 적용
    //orderByChild = 쿼리문에서 조건(자식요소 안에 있는 키(category)를 기준으로 데이터를 정렬)
    // equalTo = 지정된 값과 일치하는 데이터만 반환
    const q = query(productRef, orderByChild("category"), equalTo(category));
    //console.log("q : ", q)
    const snapshot = await get(q);
    // 현재 순간의 데이터를 캡쳐한다 즉 가져온다. snapshot
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    } else {
      return [];
    }
    //console.log("snapshot :", snapshot)
  } catch (err) {
    console.error("err :", err);
    return [];
  }
}

//디테일 페이지에서 전달받은 id를 이용해서 database에 있는 동일한 id의 제품과 매칭
export async function getProductId(productId) {
  try {
    const productRef = databaseRef(database, `products/${productId}`);
    const snapshot = await get(productRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
  } catch (err) {
    console.error("err :", err);
  }
}

export async function getCart(userId) {
  try {
    const snapshot = await get(databaseRef(database, `cart/${userId}`));
    if (snapshot.exists()) {
      const item = snapshot.val();
      return Object.values(item);
    } else {
      return [];
    }
  } catch (err) {
    console.error("err :", err);
  }
}

export async function updateCart(userId, product) {
  try {
    const cartRef = databaseRef(database, `cart/${userId}/${product.id}`);
    await set(cartRef, product);
    console.log("product :", product);
  } catch (err) {
    console.error("err :", err);
  }
}

//장바구니 리스트 삭제
export async function removeCart(userId, productId) {
  //console.log("userId :", userId)
  //console.log("productId :", productId)

  return remove(databaseRef(database, `cart/${userId}/${productId}`));
}

export async function getSearchProducts(text) {
  try {
    const dbRef = databaseRef(database, "products");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const allProducts = Object.values(data);
      //console.log("allProducts :", allProducts)

      if (allProducts.length === 0) {
        return [];
      }
      const matchProducts = allProducts.filter((product) => {
        const itemItle = product.title;
        console.log("itemItle :", itemItle);
        return itemItle.includes(text);
      });
      return matchProducts;
    } else {
      return [];
    }
  } catch (err) {
    console.error("err :", err);
  }
}

//이메일 회원가입
export async function joinEmail(email, password, name) {
  const auth = getAuth();
  try {
    const userData = await createUserWithEmailAndPassword(auth, email, password);
    const user = userData.user;
    await updateProfile(user, {
      displayName: name,
    });
    await signOut(auth);
    return { success: true };
  } catch (err) {
    console.error("err :", err);
  }
}

//이메일 로그인
export async function loginEmail(email, password) {
  try {
    const userData = await signInWithEmailAndPassword(auth, email, password);
    return userData.user;
  } catch (err) {
    console.error("err :", err);
  }
}

export { database };
