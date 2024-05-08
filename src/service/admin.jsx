import { database } from "@/api/api";
import { get, ref } from "firebase/database";

//관리자 아이디 체크
export async function adminUser(user) {
  try{
    const dbRef = ref(database, "admin")
    const snapshot = await get(dbRef)
    if(snapshot.exists()){
      const admins = snapshot.val()
      const isAdmin = admins.includes(user.email)
      return {...user, isAdmin}
    }
    return user
  } catch(err) {
    console.log("err :", err)
    return user
  }
}