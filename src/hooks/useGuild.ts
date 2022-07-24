import { connect, resultsToObjects } from "@tableland/sdk";
import type { Guild, Topic } from "@/interfaces";
import { useForceRefetchTopics, useSelectedGuild, useTopics } from "@/jotai";
import { useEffect } from "react";

export const useGuild = (name: string) => {
  const TABLE_NAME = process.env.NEXT_PUBLIC_GUILD_TABLE_NAME;
  const [guild, setGuild] = useSelectedGuild();
  const [topics, setTopics] = useTopics();
  const [refetch, setRefetch] = useForceRefetchTopics();

  useEffect(() => {
    fetch(name);
  }, [name]);

  useEffect(() => {
    if (refetch && name) {
      fetch(name);
    }
  }, [refetch]);

  const fetch = async (name: string) => {
    if (!name) return;
    const tableland = await connect({ network: "testnet" });
    const results = await tableland.read(
      `SELECT * FROM ${TABLE_NAME} where name = '${name}';`
    );

    const entries = resultsToObjects(results) as Guild[];
    const g = entries[0];
    setGuild(g);
    const { topicTable } = g;
    const topicResults = await tableland.read(`SELECT * FROM ${topicTable};`);
    const t = resultsToObjects(topicResults) as Topic[];
    setTopics(t);
    setRefetch(false);
  };

  return {
    fetch,
    guild,
    topics,
  };
};
