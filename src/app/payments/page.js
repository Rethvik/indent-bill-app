import React from 'react'
import AmountDashboard from './components/AmountDashboard';

const Payments = () => {
  return (
    <main>
        <div className='my-2 mb-3 px-4 py-2 bg-secondary rounded-md'>
            <h1 className='font-semibold'>Payments</h1>
        </div>
        <section>
            <AmountDashboard/>
        </section>
    </main>
  )
}

export default Payments;