import { Wallet, providers } from "ethers";
import { connect } from "@tableland/sdk";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const TOPIC_SCHEMA = `id int NOT NULL, issuer text NOT NULL, topic text NOT NULL, tags text, genre text, createdAt int, updatedAt int, primary key (id)`;
const TOPIC_TABLE_NAME = `topicTable`;
const ANSWER_SCHEMA = `id int NOT NULL, topicId int NOT NULL, answerer text, answer text, isBestAnswer int default 0, createdAt int, updatedAt int, primary key (id)`;
const ANSWER_TABLE_NAME = `answerTable`;

// eslint-disable-next-line import/no-anonymous-default-export
export default async function initializeGuild(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const table = req.query.table as string;
    const id = req.query.id as string;
    const tablename = req.query.tablename as string;
    const icon = req.query.icon as string;
    if (!(table && id && tablename))
      return respondError(req, res, "No valid query");

    const PRIVATE_KEY = process.env.TBL_PRIVATE_KEY;
    const ALCHEMY_API_KEY = process.env.TBL_ALCHEMY;
    if (!(PRIVATE_KEY && ALCHEMY_API_KEY))
      return respondError(req, res, "No valid privateKey or node key");

    console.log({ PRIVATE_KEY });
    console.log({ ALCHEMY_API_KEY });

    const wallet = new Wallet(PRIVATE_KEY);

    // An RPC provider must be provided to establish a connection to the chain
    const provider = new providers.AlchemyProvider("goerli", ALCHEMY_API_KEY);
    // By default, `connect` uses the Tableland testnet validator;
    // it will sign a message using the associated wallet
    const signer = wallet.connect(provider);

    console.log("address", signer.address);

    const tableland = await connect({ network: "testnet", signer });

    //create new topic/answer table
    const { name: topicName } = await tableland.create(
      TOPIC_SCHEMA, // Table schema definition
      TOPIC_TABLE_NAME // Optional prefix; used to define a human-readable string
    );
    const { name: answerName } = await tableland.create(
      ANSWER_SCHEMA, // Table schema definition
      ANSWER_TABLE_NAME // Optional prefix; used to define a human-readable string
    );

    // Insert a row into the table
    const { hash } = await tableland.write(
      `INSERT INTO ${table} (id, name, icon, topicTable, answerTable) VALUES (${Number(
        id
      )}, '${tablename}', '${icon || ""}', '${topicName}', '${answerName}');`
    );
    console.log({ hash });
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
