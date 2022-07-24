import { Wallet, providers } from "ethers";
import { connect } from "@tableland/sdk";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async function createTopic(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const table = req.query.table as string;
    const issuer = req.query.issuer as string;
    const topic = req.query.topic as string;
    if (!(table && issuer && topic))
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

    const { rows } = await tableland.read(`SELECT * FROM ${table};`);
    const now = Date.now();

    // Insert a row into the table
    const { hash } = await tableland.write(
      `INSERT INTO ${table} (id, issuer, topic, createdAt, updatedAt) VALUES (${rows.length}, '${issuer}', '${topic}', '${now}', '${now}');`
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
