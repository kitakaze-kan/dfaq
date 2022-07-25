import { CommonSpinner } from "@/components/common/CommonSpinner";
import { Answertem } from "@/components/guild/Answertem";
import { AnswerForm } from "@/components/topic/AnswerForm";
import { CreateTopicModal } from "@/components/topic/CreateTopicModal";
import { useTopicDetail } from "@/hooks/useTopicDetail";
import { useWalletAccount } from "@/hooks/useWalletAccount";
import { useSetConnectWalletModal } from "@/jotai/ui";
import Router from "next/router";
import {FC} from "react"
import { Table, Card } from "react-daisyui";

type Props = {
    topicId: string
}
export const TopicDetail:FC<Props> = ({topicId}) => {

    const {topic, answerLoading, answers, topicLoading,createAnswer} = useTopicDetail(topicId)
    const setWalletModalShow = useSetConnectWalletModal();
    const { account } = useWalletAccount();

    const handleSubmit = async (data:any) => {
        if (!account) {
            setWalletModalShow(true);
            return;
          }
        const answer = data.answer as string
        console.log({answer})
        await createAnswer(answer)
    }

    if(!topic) {
        return (
            <main className=" text-center h-screen overflow-hidden ">
                <CommonSpinner />
            </main>
        )
    }

    return (
        <main className=" text-center h-screen overflow-hidden ">
            <div className="w-[1024px] mx-auto">
                <div className="w-fullspace-x-2 my-3">
                    <Card bordered className=" bg-card w-full m-2">
                        <Card.Body className="">
                            <h2 className="text-left text-2xl">{topic.topic}</h2>
                            <div className="my-4">
                                <AnswerForm onSubmit={handleSubmit}/>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className='overflow-x-auto w-full my-4'>
                    <h1 className="text-3xl font-bold">Answers</h1>
                    {answers && answers.length>0 && answers.map((answer) => {
                        return (
                            <Answertem key={answer.id} item={answer}/>
                        )  
                    })}
                </div>
            </div>
            <CreateTopicModal />
        </main>
    )
}