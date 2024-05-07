import {initializeApp} from 'firebase/app'
import {GoogleAuthProvider, getAuth, signInWithPopup, signOut} from 'firebase/auth'
import {getDatabase} from 'firebase/database'

//firebaseConfig : firebase 프로젝트 설정 값 객체 api키, 도메인 인증, 데이터베이스 키값.. -> env 파일에 변수로 저장하여 활용
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL : process.env.NEXT_PUBLIC_FIREBASE_DB_URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); //firebaseConfig를 기반으로 firebase설정 초기값을 초기화
const auth = getAuth(app); // 초기화된 앱을 기반으로 firebase인증 객체 생성(사용자 인증 관리)
const provider = new GoogleAuthProvider() //google로그인 기능을 사용할때 추가하는 프로바이더 객체 생성
const database = getDatabase() // 초기화된 앱을 기반으로 firebase 데이터베이스 객체 생성

console.log(firebaseConfig)

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