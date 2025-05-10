'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '@/features/userSlice';

export default function OpenRoute({ children }) {
  const router = useRouter();
  const token = useSelector((state) => state.userSlice.token);
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();

  // Load token from sessionStorage once on mount
  let storedToken
  useEffect(() => {
    storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      dispatch(setToken(storedToken));
    } else {
      setChecked(true); // allow guests
    }
  }, [dispatch]);

  // Redirect if token becomes available
  useEffect(() => {
    if (storedToken) {
      router.push('/dashboard');
    } else if (!token) {
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

// export default function OpenRoute({ children }) {
//   const router = useRouter();
//   const token = useSelector((state) => state.userSlice.token);
//   const [checked, setChecked] = useState(false);
//   const dispatch = useDispatch()

//   dispatch(setToken(JSON.parse(sessionStorage.getItem('token'))))

//   useEffect(() => {
//     if (token) {
//       router.push('/dashboard');
//     } else {
//       setChecked(true); // allow rendering for guests
//     }
//   }, [token, router]);

//   if (!checked) return null;

//   return <>{children}</>;
// }

