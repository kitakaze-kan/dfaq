import { TopicForm } from "@/interfaces";
import { useSelectedGuild, useSetForceRefetchTopics } from "@/jotai";
import { useWalletAccount } from "./useWalletAccount";

export const useTopic = () => {
  const [guild, _] = useSelectedGuild();
  const { account } = useWalletAccount();
  const refetch = useSetForceRefetchTopics();

  const createTopic = async (data: TopicForm) => {
    if (!account) {
      return;
    }

    try {
      const res = await fetch(
        `/api/createTopic?table=${guild?.topicTable}&issuer=${account}&topic=${data.title}`
      );
      console.log(res);
      refetch(true);
    } catch (e) {
      console.error(e);
    }
  };

  return {
    createTopic,
  };
};
