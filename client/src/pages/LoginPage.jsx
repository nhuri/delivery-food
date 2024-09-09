// import Login from "../users/Login";
// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";

// const LoginPage = () => {
//   const [searchParams] = useSearchParams();
//   const source = searchParams.get("source");

//   const [loginModal, setLoginModal] = useState(false);
//   const [openedOnce, setOpenedOnce] = useState(false); // למעקב אחרי פתיחה אחת בלבד

//   useEffect(() => {
//     // נוודא שה־loginModal נפתח רק פעם אחת
//     if (source === "nav" && !openedOnce) {
//       setLoginModal(true);
//       setOpenedOnce(true);
//     }
//   }, [source, openedOnce]);

//   return (
//     <Login
//       setLoginModal={setLoginModal}
//       loginModal={loginModal}
//       source={source}
//     />
//   );
// };

// export default LoginPage;
