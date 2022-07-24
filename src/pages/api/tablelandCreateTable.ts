import { Wallet, providers } from "ethers";
import { connect } from "@tableland/sdk";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async function tablelandCreateTable(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // const tableName = req.query.name as string;
    // const queryType = req.query.querytype as string;

    const PRIVATE_KEY = process.env.TBL_PRIVATE_KEY;
    const ALCHEMY_API_KEY = process.env.TBL_ALCHEMY;
    if (!(PRIVATE_KEY && ALCHEMY_API_KEY))
      return respondError(req, res, "No valid privateKey or node key");
    const wallet = new Wallet(PRIVATE_KEY);

    // An RPC provider must be provided to establish a connection to the chain
    const provider = new providers.AlchemyProvider("goerli", ALCHEMY_API_KEY);
    // By default, `connect` uses the Tableland testnet validator;
    // it will sign a message using the associated wallet
    const signer = wallet.connect(provider);
    const tableland = await connect({ network: "testnet", signer });

    // Create a new table with a supplied SQL schema and optional `prefix`
    // @return {Connection} Connection object, including the table's `name`
    const { name } = await tableland.create(
      `id int, name text, icon text`, // Table schema definition
      "guildtable" // Optional prefix; used to define a human-readable string
    );

    //	The table's `name` is in the format `{prefix}_{chainId}_{tableId}`
    console.log(name); // e.g., mytable_4_1
    // Without the supplied `prefix`, `name` would be be `_4_1`

    // Insert a row into the table
    const { hash } = await tableland.write(
      `INSERT INTO ${name} VALUES (0, 'VESS', 'https://bafybeibabhdxh72vd7p35awdmm3hexalpj6uiivlu7wyb3hrocm7neveri.ipfs.dweb.link/vess_logo.png');`
    );
    res.statusCode = 200;
    res.json({ hash: hash });
    res.end();
  } catch (error) {
    console.log("error", error);
    respondError(req, res, JSON.stringify(error));
  }
}

const respondError = (
  req: NextApiRequest,
  res: NextApiResponse,
  text: string
) => {
  res.statusCode = 500;
  res.json({
    method: req.method,
    error: text,
  });
  res.end();
};
