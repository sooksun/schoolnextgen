'use client'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/**
 * Single toaster instance. Mount once in src/app/layout.tsx (root layout).
 * Mounting twice will duplicate toasts.
 */
export function AppToaster() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3500}
      newestOnTop
      pauseOnFocusLoss={false}
      hideProgressBar={false}
      theme="colored"
      limit={4}
    />
  )
}
