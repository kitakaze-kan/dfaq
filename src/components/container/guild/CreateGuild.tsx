import { CreateGuildCard } from "@/components/guild/CreateGuildCard";
import { useCreateGuild } from "@/hooks/useCreateGuild";
import { FC } from "react";

export const CreateGuildContainer:FC = () => {

    const {create} = useCreateGuild()

    return (
        <main className=" text-center h-screen overflow-hidden flex justify-center ">
            <CreateGuildCard onSubmit={create}/>
        </main>
    )

}