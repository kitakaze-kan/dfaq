import { GuildForm } from "@/interfaces";
import { connect } from "@tableland/sdk";

export const useCreateGuild = () => {
  const TABLE_NAME = process.env.NEXT_PUBLIC_GUILD_TABLE_NAME;
  const create = async (data: GuildForm) => {
    console.log({ data });

    if (!TABLE_NAME) return;

    try {
      const tableland = await connect({
        network: "testnet",
        chain: "ethereum-goerli",
      });
      const { name, icon } = data;

      console.log(TABLE_NAME);

      const { rows } = await tableland.read(`SELECT * FROM ${TABLE_NAME};`);

      const res = await fetch(
        `/api/initializeGuild?table=${TABLE_NAME}&id=${rows.length.toString()}&tablename=${name}&icon=${
          icon || ""
        }`
      );

      console.log(res);
    } catch (error) {
      console.log("error", error);
    }
  };

  return {
    create,
  };
};
