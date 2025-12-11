import Link from 'next/link';
import React from 'react';

export default function PaymentCancelPage() {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-red-50 p-4'>
      <div className='bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center'>
        <div className='text-red-500 text-5xl mb-4'>✗</div>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Payment Cancelled</h1>
        <p className='text-gray-600 mb-6'>No charges were made to your account.</p>
        
        <div className='mb-6'>
          <div className='flex justify-between py-2'>
            <span>Status:</span>
            <span className='text-red-600 font-semibold'>Cancelled</span>
          </div>
        </div>
        
        <div className='flex flex-col gap-3'>
          <Link href="/">
            <button className='w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600'>
              Try Again
            </button>
          </Link>
          
          <Link href="/">
            <button className='w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50'>
              Return to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}