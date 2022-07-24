import { CommonSpinner } from "@/components/common/CommonSpinner";
import { DisplayAvatar } from "@/components/common/DisplayAvatar";
import { UserItemCard } from "@/components/user/UserItemCard";
import { useUserItems } from "@/hooks/useUserItems";
import { FC } from "react";
import { Card } from "react-daisyui";

type UserContainerProps = {
    account: string
}
export const UserContainer:FC<UserContainerProps> = ({account}) => {

    const {itemsList, isLoading} = useUserItems(account)

    if(isLoading) {
        return (
            <main className=" text-center h-screen overflow-hidden ">
                <CommonSpinner />
            </main>
        )
    }

    return (
        <main className="text-center h-screen px-4">
            <Card bordered normal={"lg"} className="w-full bg-card">
                <Card.Body className={"text-left"}>
                <DisplayAvatar
                  did={account}
                  label={
                    account
                  }
                  hiddenLabelOnSp={true}
                />
                </Card.Body>
            </Card>

            <div className="w-full mx-auto my-4">
                {itemsList && itemsList.map(item => {
                    return (
                        <>
                            <h2 className="text-left text-3xl font-bold my-2 ">{item.guild.name}</h2>
                            {(item.topics && item.topics.length>0) && (
                                <>
                                    <h3 className="text-left text-xl font-bold">Questions</h3>
                                    <div className="grid grid-cols-4 flex-wrap p-4 items-center overflow-auto w-full mx-auto">
                                        {item.topics.map((t) => {
                                            return (
                                                <UserItemCard key={t.id} guild={item.guild} topic={t} />
                                            )
                                        })}
                                    </div>
                                </>
                            )}
                            {(item.answers && item.answers.length>0) && (
                                <>
                                    <h3 className="text-left text-xl font-bold">Answers</h3>
                                    <div className="grid grid-cols-4 flex-wrap p-4 items-center overflow-auto w-full mx-auto">
                                        {item.answers.map((a) => {
                                            return (
                                                <UserItemCard key={a.id} guild={item.guild} answer={a} />
                                            )
                                        })}
                                    </div>
                                </>
                            )}
                        </>
                    )
                })}
            </div>
        </main>
    )
}