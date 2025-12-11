import Link from 'next/link';
import React from 'react';

export default function PaymentSuccessPage() {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-green-50 p-4'>
      <div className='bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center'>
        <div className='text-green-500 text-5xl mb-4'>✓</div>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Payment Successful</h1>
        <p className='text-gray-600 mb-6'>Thank you for your purchase!</p>
        
        <div className='mb-6'>
          <div className='flex justify-between py-2'>
            <span>Transaction ID:</span>
            <span className='font-semibold'>PH-HealthCare-2025-11-4-23-20</span>
          </div>
          <div className='flex justify-between py-2'>
            <span>Amount:</span>
            <span className='font-bold text-green-600'>$600</span>
          </div>
        </div>
        
        <Link href="/">
          <button className='w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600'>
            Return to Home
          </button>
        </Link>
      </div>
    </div>
  );
}