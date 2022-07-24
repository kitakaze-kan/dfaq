import { connect, resultsToObjects } from "@tableland/sdk";
import type { Guild } from "@/interfaces";
import { useGuilds } from "@/jotai";
import { useEffect } from "react";

export const useGuildList = () => {
  const TABLE_NAME = process.env.NEXT_PUBLIC_GUILD_TABLE_NAME;
  const [guilds, setGuilds] = useGuilds();

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const tableland = await connect({ network: "testnet" });
    const results = await tableland.read(`SELECT * FROM ${TABLE_NAME};`);

    const entries = resultsToObjects(results) as Guild[];
    setGuilds(entries);
    for (const guild of entries) {
      console.log({ guild });
    }
  };

  return {
    fetch,
    guilds,
  };
};
