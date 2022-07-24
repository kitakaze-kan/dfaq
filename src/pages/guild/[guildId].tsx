import { GuildItemList } from '@/components/container/guild/List'
import { useGuild } from '@/hooks/useGuild'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'


const GuildPage: NextPage = () => {
  const router = useRouter()
  const guildId = router.query.guildId as string
  const {guild} = useGuild(guildId)

  if(!guild) {
    return (
      <h1>No Project</h1>
    )
  }
  
  return (
    <GuildItemList guildName={guild.name} />
  )
}


export default GuildPage
