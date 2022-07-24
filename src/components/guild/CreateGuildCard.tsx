import { useFileUpload } from "@/hooks/useFileUpload";
import { GuildForm } from "@/interfaces";
import { FC,useEffect } from "react";
import { Card,Button } from "react-daisyui";
import { useForm } from "react-hook-form";
import { FileUploader } from "./parts/FileUploader";

type Props = {
    onSubmit:(data: any) => void
}
export const CreateGuildCard:FC<Props> = ({onSubmit}) => {

    const {cid, status} = useFileUpload()

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<GuildForm>();

    const onClickSubmit = (data:any) => {
        if(!data) return
        onSubmit(data)
    }

    useEffect(() => {
        if(cid && status==="completed"){
            setValue("icon", cid)
        }
    },[cid, status])


    
    return (
        <>
        <Card bordered normal={"lg"} className="w-[600px] h-[600px] md:h-[750px] bg-neutral overflow-hidden">
            <Card.Body className={"text-left"}>
                <form
                    className="w-full h-full"
                    onSubmit={handleSubmit(onClickSubmit)}
                >
                    <Card.Title>Create Guild</Card.Title>
                    <div className="divider"></div>
                    <div className="overflow-y-scroll h-[350px] md:h-[500px]">
                        {/* title */}
                        <div className="flex flex-wrap items-center">
                            <p className="font-semibold">
                            Name(Required)
                            <span className="cols-span-1 px-3 text-xs text-red-600">
                                {errors.name?.message}
                                </span>
                            </p>
                        </div>
                        <div className="mb-3">
                            <input
                            className="w-full my-1 py-1 px-6 rounded-full text-xs md:text-sm bg-form border-none hover:border-none focus:outline-white appearance-none"
                            placeholder={"Enter a summary... (e.g.Bitcoin Development)"}
                            {...register("name", { required: "Please enter a guild name" })}
                            />
                        </div>
                        <div className="flex flex-wrap items-center">
                            <p className="font-semibold">
                                Icon
                            </p>
                        </div>
                        <div className="mb-3">
                            {cid && (
                            <p
                                className="w-full my-1 py-1 px-6 border rounded-full text-xs md:text-sm bg-form border-none hover:border-none focus:outline-white appearance-none text-left"
                            >{cid}</p> 
                            )}
                            <FileUploader />
                            <div className="w-full grid grid-cols-2 mb-2">
                            {errors && errors.icon && (
                                <span className="cols-span-1 px-3 text-xs text-red-600">
                                {errors.icon.message}
                                </span>
                            )}
                            </div>
                        </div>
                    </div>
                    <Card.Actions className="justify-end">
                        <Button type="submit" className=" bg-gradient-to-r from-border_l via-border_via to-border_r">Create</Button>
                    </Card.Actions>
                </form>
                </Card.Body>
        </Card>
        </>
    )
}