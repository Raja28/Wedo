
'use client';

import { useEffect } from 'react';

export default function BootstrapClientLoader() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js'); 
  }, []);

  return null;
}
