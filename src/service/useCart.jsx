import { getCart, updateCart } from "@/api/api";
import { useAuthContext } from "@/app/context/authContext";
// import { useAuthContext } from "@/context/authContext";
import { Mutation, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useCart() {
  const {uid} = useAuthContext() // 로그인된 사용자 id를 가져옴
  const queryClient = useQueryClient()
  //yarn add @tanstack/react-query
  //서버 상태관리 쿼리문, 데이터동기화, 캐싱, 업데이트를 관리하는 라이브러리

  const cartInfo = useQuery({
    queryKey : ['cart', uid || ''],
    queryFn : ()=> getCart(),
    enabled: !!uid,
  })

  //카트정보를 가져오기 위한 쿼리문
  const addItemCart = useMutation({
  //useMutation : 정보를 업데이트할때 사용하는 쿼리구문
  mutationFn : (product)=> updateCart(uid, product),
  onSuccess : ()=> {
    queryClient.invalidateQueries(['cart',uid])
    }
  })
  return {addItemCart}
}