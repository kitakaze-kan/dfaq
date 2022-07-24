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
        <Table.Row className="cursor-pointer">
            <span></span>
            <span>{item.answer}</span>
            <span>
                {ensLoading ? (
                    <CommonSpinner size="sm" />
                ) : (
                    <span>{ens}</span>
                )}    
            </span>
        </Table.Row>
    )
}