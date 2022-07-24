import { Answer, Guild, Topic } from "@/interfaces";
import { Button } from "grommet";
import Router from "next/router";
import { FC } from "react";
import { Card } from "react-daisyui";

type UserItemCardProps = {
    guild: Guild
    topic?: Topic
    answer?: Answer
}
export const UserItemCard: FC<UserItemCardProps> = ({guild, topic, answer}) => {

    const goToTopic = () => {
      Router.push(`/guild/${guild.name}/topic/${topic ? topic.id: answer?.topicId}`)
    }

    if(topic) {
        return (
            <Card bordered className=" bg-card w-auto h-40 m-2 overflow-y-scroll" onClick={() => goToTopic()}>
                <Card.Body>
                    <Card.Title tag="h2">{topic.topic}</Card.Title>
                    <Card.Actions className="justify-end">
                      <Button onClick={() => goToTopic()} className=" bg-gradient-to-r from-border_l via-border_via to-border_r">Go Topic</Button>
                  </Card.Actions>
                </Card.Body>
            </Card>
        )
    }

    if(answer) {
      return (
        <Card bordered className=" bg-card w-auto h-40 m-2 overflow-y-scroll" onClick={() => goToTopic()}>
            <Card.Body className="text-left">
                <Card.Title tag="h2">{answer.answer}</Card.Title>
                <Card.Actions className="justify-end">
                      <Button onClick={() => goToTopic()} className=" bg-gradient-to-r from-border_l via-border_via to-border_r">Go Topic</Button>
                  </Card.Actions>
            </Card.Body>
        </Card>
      )
    }


    return (
        <Card bordered className=" bg-card w-auto h-40 m-2" >
            <Card.Body className="text-left">
                <Card.Title tag="h2">No Item</Card.Title>
            </Card.Body>
        </Card>
    )
}