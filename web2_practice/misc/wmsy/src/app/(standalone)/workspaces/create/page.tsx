import { getCurrent } from '@/features/auth/queries'
import { CreateWorkspaceForm } from '@/features/workspaces/components/create-workspace-form'
import { redirect } from 'next/navigation'
import React from 'react'

export const dynamic = 'force-dynamic';


const WorkspaceCreatePage = async () => {
    
  const currentUser = await getCurrent()
  
  if (!currentUser) {
    redirect('/sign-in')
  }
  return (
    <div className='w-full lg:max-w-xl'>
      <CreateWorkspaceForm />
    </div>
  )
}

export default WorkspaceCreatePage
