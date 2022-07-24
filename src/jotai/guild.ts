import { Guild, Topic } from "@/interfaces";
import { atom, useAtom, useSetAtom } from "jotai";

export const guildList = atom<Guild[] | null>(null);

export const useGuilds = () => useAtom(guildList);

export const guild = atom<Guild | null>(null);

export const useSelectedGuild = () => useAtom(guild);

export const topics = atom<Topic[] | null>(null);

export const useTopics = () => useAtom(topics);

export const forceRefetchTopics = atom<boolean>(false);

export const useForceRefetchTopics = () => useAtom(forceRefetchTopics);
export const useSetForceRefetchTopics = () => useSetAtom(forceRefetchTopics);
