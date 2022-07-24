import { useENS } from "@/hooks/useENS";
import { Topic } from "@/interfaces";
import { FC } from "react";
import { Table } from "react-daisyui";
import { CommonSpinner } from "../common/CommonSpinner";

type TopicItemProps = {
    item: Topic
    onClick: (topic:Topic) => void
}
export const TopicItem: FC<TopicItemProps> = ({item,onClick}) => {

    const { ens, ensLoading } = useENS(item.issuer);


    return (
        <Table.Row className="cursor-pointer" onClick={() => onClick(item)}>
            <span></span>
            <span>{item.topic}</span>
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