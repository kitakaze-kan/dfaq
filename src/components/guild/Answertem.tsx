import { useENS } from "@/hooks/useENS";
import { Answer } from "@/interfaces";
import { FC } from "react";
import { Table } from "react-daisyui";
import { CommonSpinner } from "../common/CommonSpinner";

type TopicItemProps = {
    item: Answer
}
export const Answertem: FC<TopicItemProps> = ({item}) => {

    const { ens, ensLoading } = useENS(item.answerer);


    return (
        <div className="w-full text-left my-2">
            <textarea className="w-full my-1 py-2 px-6 bg-form border rounded-xl text-lg border-none hover:border-none focus:outline-white appearance-none" readOnly value={item.answer} />
            <p className="text-right">
                {ensLoading ? (
                    <CommonSpinner size="sm" />
                ) : (
                    <span>by {ens}</span>
                )}    
            </p>
        </div>
    )
}