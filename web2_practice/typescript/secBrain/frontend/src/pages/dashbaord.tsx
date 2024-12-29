import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { CreateContentModal } from '../components/CreateContentModal'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import { Sidebar } from '../components/Sidebar'
import { useState } from 'react'

export function Dashboard () {
    
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
    <div>
      <Sidebar />
    </div>
    <div className='ml-72 min-h-screen bg-gray-100'>
      <CreateContentModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <div className='flex p-2 gap-2 justify-end'>
        
        <Button onClick={() => {setModalOpen(true)}} startIcon={<PlusIcon size='md' />} variant='primary' text='hi' />
        <Button variant='secondary' text='sec' startIcon={<ShareIcon />} />
      </div>
      <div className='flex gap-2 '>
        <Card title='hi' link='https://www.youtube.com/watch?v=ZkpTrG-lb2w' type='youtube' />
        <Card title='hi' link='https://x.com/marc_louvion/status/1861066068036583874' type='twitter' />
      </div>
    </div>
    
    </>
  )
}