'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '@/features/userSlice';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const token = useSelector((state) => state.userSlice.token);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);

  let storedToken
  useEffect(() => {
    storedToken = sessionStorage.getItem('token');
    if (storedToken && !token) {
      dispatch(setToken(storedToken));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (!storedToken) {
      router.push('/login');
    } else {
      setChecked(true);
    }
  }, [token, router]);

  if (!checked) return null;

  return <>{children}</>;
}


// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
// import { setToken } from '@/features/userSlice';

// export default function ProtectedRoute({ children }) {
//   const router = useRouter();
//   const token = useSelector((state) => state.userSlice.token);
//   const [checked, setChecked] = useState(false);
//   const dispatch = useDispatch()

//   dispatch(setToken(sessionStorage.getItem('token')))

//   useEffect(() => {
//     if (!token) {
//       router.push('/login');
//     } else {
//       setChecked(true);
//     }
//   }, [token, router]);

//   if (!checked) return null;

//   return <>{children}</>;
// }




// // components/ProtectedRoute.js
// // import { useRouter } from 'next/router';
// // import { useEffect } from 'react';
// import { Navigate } from 'react-router-dom';


// export default function ProtectedRoute({ children }) {
//     // const { token } = useSelector((state) => state.user)

//     if (token === null) {
//         return children
//     } else {
//         return <Navigate to={"/dashboard"} />
//     }

//     // const router = useRouter();

//     // useEffect(() => {
//     //     if (!loading && !user) {
//     //         router.push('/login');
//     //     }
//     // }, [user, loading, router]);

//     // if (loading || !user) {
//     //     return <p>Loading...</p>;
//     // }

//     return <>{children}</>;
// }
