import { TopicForm } from "@/interfaces";
import { useSetModal } from "@/jotai/ui";
import { FC } from "react";
import { Card,Button } from "react-daisyui";
import { useForm } from "react-hook-form";

type AnswerFormProps = {
    onSubmit:(data: any) => void
}
export const AnswerForm:FC<AnswerFormProps> = ({onSubmit}) => {

    const setShowModal = useSetModal()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{answer: string}>();

    const onClickSubmit = (data:any) => {
        if(!data) return
        onSubmit(data)
    }
    
    return (
        <>
            <form
                className="w-full"
                onSubmit={handleSubmit(onClickSubmit)}
            >
                <div className="overflow-y-scroll">
                    {/* answer */}
                    <div className="mb-3">
                        <textarea
                        className="w-full my-1 py-2 px-6 border rounded-xl text-xs md:text-sm bg-form border-none hover:border-none focus:outline-white appearance-none"
                        rows={3}
                        placeholder={"Answer here"}
                        {...register("answer",{ required: "Please enter a answer" })}
                        />
                        <div className="w-full grid grid-cols-2 mb-2">
                        <span className="cols-span-1 px-3 text-xs text-red-600">
                            {errors.answer?.message}
                        </span>
                        </div>
                    </div>
                </div>
                <Card.Actions className="justify-end">
                    <Button type="submit" className=" bg-gradient-to-r from-border_l via-border_via to-border_r">Answer</Button>
                </Card.Actions>
            </form>
        </>
    )
}