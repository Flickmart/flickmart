import MobileHeader from '@/components/MobileHeader'
import React from 'react'

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <>
      <MobileHeader title="Back" />
      {children}
    </>
  )
}
