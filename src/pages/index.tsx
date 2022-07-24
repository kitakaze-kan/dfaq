import { useGuildList } from '@/hooks/useGuildList'
import { Guild } from '@/interfaces'
import { useSelectedGuild } from '@/jotai'
import type { NextPage } from 'next'
import Link from 'next/link'
import Router from 'next/router'
import { Avatar, Button,Card } from 'react-daisyui'


const Home: NextPage = () => {

  const {guilds} = useGuildList()
  const [_, selectGuild] = useSelectedGuild()

  const goToGuild = (guild: Guild) => {
    selectGuild(guild)
    console.log({guild})
    Router.push(`/guild/${guild.name.toString()}`)
  }
  
  return (
    <main className=" text-center h-screen overflow-hidden flex justify-center ">
            <div className="w-[1024px] text-center pt-20 mx-auto">
              <div className="relative text-center mx-auto max-w-3xl">
                <h1 className="text-5xl font-bold">DFAQ</h1>
              </div>
              <Link href="/create" className="">
                <Button type="button" className="my-24 px-10 py-3 text-xl  bg-gradient-to-r from-border_l via-border_via to-border_r">New Project</Button>
              </Link>
              <div className="w-full">
                <h2 className="text-3xl font-bold">Projects</h2>
                <div className="w-full flex">
                  {guilds && guilds.length>0 && guilds.map(guild => {
                    return (
                      <Card key={guild.id} bordered className=" bg-card w-auto m-2">
                          <Card.Body>
                              <Avatar className="mx-auto" src={guild.icon || "https://bafybeibabhdxh72vd7p35awdmm3hexalpj6uiivlu7wyb3hrocm7neveri.ipfs.dweb.link/vess_logo.png"} />
                              <Card.Title tag="h2">{guild.name}</Card.Title>
                              <Card.Actions className="justify-end">
                                  <Button onClick={() => goToGuild(guild)} type="button" className=" bg-gradient-to-r from-border_l via-border_via to-border_r">Go To Project</Button>
                              </Card.Actions>
                          </Card.Body>
                      </Card>
                    )
                  })}
                </div>
                

              </div>
            </div>
        </main>
  )
}

export default Home
