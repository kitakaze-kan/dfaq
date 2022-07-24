import { UserContainer } from '@/components/container/user';
import type { NextPage } from 'next'
import { useRouter } from 'next/router';


const UserPage: NextPage = () => {
    const router = useRouter()
    const account = router.query.account as string
  
  return (
    <UserContainer account={account}/>
  )
}


export default UserPage
