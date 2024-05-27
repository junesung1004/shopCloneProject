import { getCart, removeCart, updateCart } from "@/api/api";
import { useAuthContext } from "@/app/context/authContext";
// import { useAuthContext } from "@/context/authContext";
import { Mutation, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// react-query 비동기로 데이터를 패칭하고 캐싱하는 라이브러리
// 데이터가 변경될때 자동으로 갱신
// 데이터를 자주 업데이트 하거나 변경해야 하는 경우

export default function useCart() {
  const { uid } = useAuthContext(); // 로그인된 사용자 id를 가져옴
  const queryClient = useQueryClient(); // 쿼리 클리이언트를 초기화 후 쿼리를 관리
  //yarn add @tanstack/react-query
  //서버 상태관리 쿼리문, 데이터동기화, 캐싱, 업데이트를 관리하는 라이브러리

  const cartInfo = useQuery({
    queryKey: ["cart", uid || ""], // 식별하는 고유 키값
    queryFn: () => getCart(uid), // 데이터를 가져오는 함수
    enabled: !!uid, //사용자 id가 있을때에만 실행
  });

  //useQuery : 데이터를 가져오고 캐시하고, 상태를 관리하는데 사용

  //카트정보를 가져오기 위한 쿼리문
  const addItemCart = useMutation({
    //useMutation : 정보를 업데이트할때 사용하는 쿼리구문
    mutationFn: (product) => updateCart(uid, product),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", uid]);
    },
  });

  // useMutationfn : 데이터를 업데이트 하는 함수
  // onSuccess : 업데이트가 성공적으로 완료된 후 실행
  //invalidateQueries : 기존 캐시를 삭제하고 상품의 정보를 최신으로 업데이트 하기 위해서 데이터를 다시 캐싱

  const removeItemCart = useMutation({
    mutationFn: (id) => removeCart(uid, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", uid]);
    },
  });

  return { addItemCart, cartInfo, removeItemCart };
}
