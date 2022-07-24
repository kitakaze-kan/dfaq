import { TopicDetail } from '@/components/container/guild/Detail'
import { GuildItemList } from '@/components/container/guild/List'
import { useGuild } from '@/hooks/useGuild'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'


const GuildPage: NextPage = () => {
  const router = useRouter()
  const guildId = router.query.guildId as string
  const topicId = router.query.topicId as string  
  return (
    <TopicDetail topicId={topicId} />
  )
}


export default GuildPage
