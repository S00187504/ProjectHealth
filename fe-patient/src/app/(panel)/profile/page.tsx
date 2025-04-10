import React from 'react'
import UserAvaters from './userAvaters/userAvaters'
import UserPersonal from './userPersonal/userPersonal'
import UserMedical from './userMedical/userMedical'
import UserIdentification from './userIdentification/userIdentification'
import { Button } from '@/components/ui/button'
import { FaArrowLeftLong } from 'react-icons/fa6'
import Link from 'next/link'

function page() {
  return (
    <section className='container-fluid my-6'>
      <Button variant='ghost'>
        <Link
          href='/dashboard'
          className='flex items-center gap-2'
        >
          <FaArrowLeftLong className='text-gray-700 dark:text-gray-200' /> <span>Back</span>
        </Link>
      </Button>
      <UserAvaters />
      <UserPersonal />
      <UserMedical />
      <UserIdentification />
    </section>
  )
}

export default page