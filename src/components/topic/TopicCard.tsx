import { TopicForm } from "@/interfaces";
import { useSetModal } from "@/jotai/ui";
import { FC } from "react";
import { Card,Button } from "react-daisyui";
import { useForm } from "react-hook-form";

type TopicCardProps = {
    onSubmit:(data: any) => void
}
export const TopicCard:FC<TopicCardProps> = ({onSubmit}) => {

    const setShowModal = useSetModal()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TopicForm>();

    const onClickSubmit = (data:any) => {
        if(!data) return
        onSubmit(data)
    }
    
    return (
        <>
        <Card bordered normal={"lg"} className="w-full h-auto bg-card overflow-hidden">
            <Card.Body className={"text-left"}>
                <form
                    className="w-full"
                    onSubmit={handleSubmit(onClickSubmit)}
                >
                    <div className="overflow-y-scroll">
                        {/* title */}
                        <div className="flex flex-wrap items-center">
                            <p className="font-semibold">
                            Title
                            <span className="cols-span-1 px-3 text-xs text-red-600">
                                {errors.title?.message}
                                </span>
                            </p>
                        </div>
                        <div className="mb-3">
                            <input
                            className="w-full my-1 py-1 px-6 rounded-full text-xs md:text-sm bg-form border-none hover:border-none focus:outline-white appearance-none"
                            placeholder={"Enter a title"}
                            {...register("title", { required: "Please enter a title" })}
                            />
                        </div>

                        {/* detail */}
                        <div className="flex flex-wrap items-center">
                            <p className="font-semibold">detail(optional)</p>
                        </div>
                        <div className="mb-3">
                            <textarea
                            className="w-full my-1 py-2 px-6 border rounded-xl text-xs md:text-sm bg-form border-none hover:border-none focus:outline-white appearance-none"
                            rows={3}
                            {...register("detail")}
                            />
                            <div className="w-full grid grid-cols-2 mb-2">
                            <span className="cols-span-1 px-3 text-xs text-red-600">
                                {errors.detail?.message}
                            </span>
                            </div>
                        </div>
                    </div>
                    <Card.Actions className="justify-end">
                        <Button onClick={() => setShowModal(false)} color="primary">
                            Cancel
                        </Button>
                        <Button type="submit" className=" bg-gradient-to-r from-border_l via-border_via to-border_r">Create</Button>
                    </Card.Actions>
                </form>
                </Card.Body>
        </Card>
        </>
    )
}