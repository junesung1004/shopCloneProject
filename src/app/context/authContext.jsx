"use client";

import { googleLogin, googleLogount, onUserState } from "@/api/api";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
//context 컴포넌트 간에 어떤 값들을 고용할 수 있게 해주는 hook

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(); //로그인 사용자 값 저장 상태변수
  const [unSubScribe, setUnSubScribe] = useState(); //상태 변경 감지 (firebase에서 사용자 인증상태 )
  const [isLoading, setIsLoading] = useState(true); // 로딩 감지

  useEffect(() => {
    const storeUser = sessionStorage.getItem("user");
    //sessionStorage : 브라우저에 저장소 : 로그인을 한 사용자의 정보값을 세션스토리지에 저장
    //getItem : 데이터를 읽어옴, setItem : 데이터를 저장, removeItem : 특정데이터 삭제, clear : 전체 데이터 삭제
    //key(index) : 해당 인덱스에 키를 받아오는, length : 항목 갯수
    if (storeUser) {
      setUser(JSON.parse(storeUser));
      //storeUser에 정보가 있으면 JSON형식의 문자열을 객체로 변환(키와 값으로)
    }

    //사용자의 상태가 변할 때
    const userChange = (newUser) => {
      setUser(newUser);
      setIsLoading(false);

      if (newUser) {
        sessionStorage.setItem("user", JSON.stringify(newUser));
        //사용자가 로그인하면 세션스토리지에 정보를 저장
      } else {
        sessionStorage.removeItem("user");
        //로그아웃을 하면 세션 스토리지에 있는 정보를 삭제
      }
    };
    const unSubScribeFun = onUserState(userChange);
    //위에서 업데이트 된 사용자를 onUserState에 넘김

    setUnSubScribe(() => unSubScribeFun);
    return () => {
      if (unSubScribeFun) {
        unSubScribeFun();
      }
    };
  }, []);

  return <AuthContext.Provider value={{ user, googleLogin, googleLogount, uid: user && user.uid, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
