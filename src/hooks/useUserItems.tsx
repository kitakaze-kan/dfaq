import {
    Answer,
    Guild,
    Topic,
  } from "@/interfaces";
  import { useGuilds } from "@/jotai";
  import { useQuery } from "react-query";
  import { connect, resultsToObjects } from "@tableland/sdk";


  const TABLE_NAME = process.env.NEXT_PUBLIC_GUILD_TABLE_NAME;
  
  export type UserItemsType = {
    guild: Guild
    topics: Topic[]
    answers: Answer[]

  }
  export const useUserItems = (account: string) => {
    const [guilds, setGuilds] = useGuilds();
  
    const { data: itemsList, isLoading } = useQuery<UserItemsType[]>(
      ["topic", account],
      () => getUserItems(),
      {
        enabled: !!account,
        staleTime: Infinity,
        cacheTime: 3000000,
      }
    );

    const getUserItems = async (): Promise<UserItemsType[]> => {
      const gList = await getGuilds()
      let items: UserItemsType[] = []
      for(const g of gList) {
        const t = await getTopic(g)
        const a = await getAnswers(g)
        if(t.length>0 || a.length>0){
          items.push({guild:g, topics: t, answers: a})
        }
      }
      return items
    }
  
    const getGuilds = async (): Promise<Guild[]> => {
      if(guilds && guilds.length>0) return guilds
      const tableland = await connect({ network: "testnet" });
      const results = await tableland.read(`SELECT * FROM ${TABLE_NAME};`);
      const entries = resultsToObjects(results) as Guild[];
      setGuilds(entries)
      return entries
    };

    const getTopic = async (guild: Guild): Promise<Topic[]> => {
      const tableland = await connect({ network: "testnet" });
      const { topicTable } = guild;
      const topicResults = await tableland.read(
        `SELECT * FROM ${topicTable} where issuer = '${account}';`
      );
      const t = resultsToObjects(topicResults) as Topic[];
      return t
    };
  
    const getAnswers = async (guild: Guild): Promise<Answer[]> => {
      const tableland = await connect({ network: "testnet" });
      const { answerTable } = guild;
      const answerResults = await tableland.read(
        `SELECT * FROM ${answerTable} where answerer = '${account}';`
      );
      const a = resultsToObjects(answerResults) as Answer[];
      return a;
    };
  
    return {
      itemsList,
      isLoading
    };
  };
  