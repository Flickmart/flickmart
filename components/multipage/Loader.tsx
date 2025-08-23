'use client';
import React from 'react';
import { SyncLoader } from 'react-spinners';

export default function Loader() {
  return (
    <div className="flex h-[80vh] items-center justify-center backdrop-blur-md">
      <SyncLoader color="#FF8100" />
    </div>
  );
}
