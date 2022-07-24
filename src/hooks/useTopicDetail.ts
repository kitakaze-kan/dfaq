import { Answer, Topic, TopicForm } from "@/interfaces";
import { useSelectedGuild, useSetForceRefetchTopics, useTopics } from "@/jotai";
import { useQuery } from "react-query";
import { useWalletAccount } from "./useWalletAccount";
import { connect, resultsToObjects } from "@tableland/sdk";

export const useTopicDetail = (topicId: string) => {
  const [guild, setGuild] = useSelectedGuild();
  const { account } = useWalletAccount();
  // const refetch = useSetForceRefetchTopics();
  const [topics, _] = useTopics();

  const { data: topic, isLoading: topicLoading } = useQuery<Topic | undefined>(
    ["topic", topicId],
    () => getTopic(),
    {
      staleTime: Infinity,
      cacheTime: 3000000,
    }
  );

  const {
    data: answers,
    isLoading: answerLoading,
    refetch,
  } = useQuery<Answer[]>(["answers", topicId], () => getAnswers(), {
    staleTime: Infinity,
    cacheTime: 3000000,
  });

  const createAnswer = async (answer: string) => {
    if (!account) {
      return;
    }

    try {
      const res = await fetch(
        `/api/createAnswer?table=${guild?.topicTable}&topic=${topicId}&answerer=${account}&answer=${answer}`
      );
      console.log(res);
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  const getTopic = async (): Promise<Topic | undefined> => {
    if (topics) {
      return topics.find((t) => t.id === Number(topicId));
    }
    if (!guild) return undefined;
    const tableland = await connect({ network: "testnet" });
    const { topicTable } = guild;
    const topicResults = await tableland.read(
      `SELECT * FROM ${topicTable} where id = ${Number(topicId)};`
    );
    const t = resultsToObjects(topicResults) as Topic[];
    return t.length > 0 ? t[0] : undefined;
  };

  const getAnswers = async (): Promise<Answer[]> => {
    if (!guild) return [];
    const tableland = await connect({ network: "testnet" });
    const { answerTable } = guild;
    const answerResults = await tableland.read(
      `SELECT * FROM ${answerTable} where topcId = ${Number(topicId)};`
    );
    const a = resultsToObjects(answerResults) as Answer[];
    return a;
  };

  return {
    topic,
    answers,
    topicLoading,
    answerLoading,
    createAnswer,
  };
};
