'use client';

import SocketProvider from '../contexts/socketContext'
export function Providers({ children }: any) {
  return (
    <SocketProvider>
      {children}
    </SocketProvider>
  );
}