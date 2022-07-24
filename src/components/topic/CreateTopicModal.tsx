import { useTopic } from "@/hooks/useTopic";
import { useWalletAccount } from "@/hooks/useWalletAccount";
import { TopicForm } from "@/interfaces";
import { useSetConnectWalletModal, useShowModal } from "@/jotai/ui";
import { FC } from "react";
import { Modal,Button } from "react-daisyui";
import { TopicCard } from "./TopicCard";

export const CreateTopicModal: FC = () => {

    const [isShow, setShow] = useShowModal()
    const {createTopic} = useTopic()

    const handleSubmit = async (data:TopicForm) => {
        await createTopic(data)
        setShow(false)
    }

    return (
        <>
            <Modal open={isShow}>
            <Modal.Header>Question</Modal.Header>
                <Modal.Body>
                    <TopicCard onSubmit={handleSubmit}/>
                </Modal.Body>
            </Modal>
        </>
    )
}