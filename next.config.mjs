/** @type {import('next').NextConfig} */
const nextConfig = {
  images : {
    domains : ['firebasestorage.googleapis.com']
  },
  compiler:{
    styledComponents : true
  },
  //reactStrictMode : false, //stricMode 해제 기본값 true
};

export default nextConfig;
