import { CommonSpinner } from "@/components/common/CommonSpinner";
import { TopicItem } from "@/components/guild/TopicItem";
import { CreateTopicModal } from "@/components/topic/CreateTopicModal";
import { useGuild } from "@/hooks/useGuild";
import { useWalletAccount } from "@/hooks/useWalletAccount";
import { Guild, Topic } from "@/interfaces";
import { useSetConnectWalletModal, useSetModal } from "@/jotai/ui";
import Router from "next/router";
import {FC} from "react"
import { Avatar, Table,Button, Card } from "react-daisyui";

type Props = {
    guildName: string
}
export const GuildItemList:FC<Props> = ({guildName}) => {

    const {guild, topics} = useGuild(guildName)
    const setShowModal = useSetModal()
    const setWalletModalShow = useSetConnectWalletModal();
    const { account } = useWalletAccount();

    const createTopic = () => {
        if (!account) {
            setWalletModalShow(true);
            return;
          }
        setShowModal(true)
    }

    const goToTopicDetail = (topic: Topic) => {
        if(!guild) return
        Router.push(`/guild/${guild.name}/topic/${topic.id}`)
    }

    if(!guild) {
        return (
            <main className=" text-center h-screen overflow-hidden ">
                <CommonSpinner />
            </main>
        )
    }

    return (
        <main className=" text-center h-screen overflow-hidden ">
            <div className="w-[1024px] mx-auto">
                <div className="w-full flex items-center space-x-2 my-3">
                    <Card bordered className=" bg-card w-full m-2">
                        <Card.Body className="flex items-center space-x-2">
                            <Avatar size={"sm"} src={guild.icon || "https://bafybeihlin6zvkyrjiqtocsvmlxn3n3vj5gqqorqah2e4z2glmbadyu34u.ipfs.dweb.link/logo_mini.png"} />
                            <h2 className="text-3xl">{guild.name}</h2>
                        </Card.Body>
                    </Card>
                </div>
                <div className='overflow-x-auto w-full my-4'>
                    <div className="flex items-center space-x-2 justify-between my-2">
                        <h1 className="text-3xl font-bold">Topics</h1>
                        <Button onClick={() => createTopic()} type="button" className=" bg-gradient-to-r from-border_l via-border_via to-border_r">New</Button>
                    </div>
                    <Table className="w-full">
                        <Table.Head>
                            <span></span>
                            <span>Topic</span>
                            <span>By</span>
                        </Table.Head>

                        <Table.Body>
                            {topics && topics.length>0 && topics.map((topic) => {
                                return (
                                    <TopicItem key={topic.id} item={topic} onClick={goToTopicDetail}/>
                                )  
                            })}
                        </Table.Body>
                    </Table>
                </div>
            </div>
            <CreateTopicModal />
        </main>
    )
}