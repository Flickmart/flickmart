import React from 'react';
import { SyncLoader } from 'react-spinners';

export default function loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <SyncLoader color="#f81" />
    </div>
  );
}
