import {
  Answer,
  DeliverableItem,
  Guild,
  ModelTypes,
  Topic,
  WorkCredential,
} from "@/interfaces";
import { useAnswers, useSelectedGuild, useTopics } from "@/jotai";
import { useQuery } from "react-query";
import { useWalletAccount } from "./useWalletAccount";
import { connect, resultsToObjects } from "@tableland/sdk";
import { useMyCeramicAcount } from "./useCeramicAcount";
import { useViewerRecord } from "@self.id/react";
import { getWCService } from "@/services/WorkCredential/WorkCredentialService";
import { convertDateToTimestampStr } from "@/utils/tools";
import { genDeliverableHash } from "@/utils/hash";

export const useTopicDetail = (topicId: string) => {
  const [guild, setGuild] = useSelectedGuild();
  const { account, chainId } = useWalletAccount();
  const { connectCeramic, mySelfID } = useMyCeramicAcount();
  const wcsRecord = useViewerRecord<ModelTypes, "workCredentials">(
    "workCredentials"
  );
  const wcService = getWCService();
  const [topics, _] = useTopics();
  const [answers, setAnswers] = useAnswers();

  const { data: topic, isLoading: topicLoading } = useQuery<Topic | undefined>(
    ["topic", topicId],
    () => getTopic(),
    {
      enabled: !!guild,
      staleTime: Infinity,
      cacheTime: 3000000,
    }
  );

  const { data: fetchedAnswers, isLoading: answerLoading } = useQuery<Answer[]>(
    ["answers", topicId],
    () => getAnswers(),
    {
      enabled: !!guild,
      staleTime: Infinity,
      cacheTime: 3000000,
    }
  );

  const createAnswer = async (answer: string) => {
    if (!(account && guild && topic && chainId)) {
      return;
    }

    const selfID = mySelfID ?? (await connectCeramic());
    if (selfID == null || selfID.did == null) {
      return false;
    }
    if (!wcsRecord.isLoadable) {
      console.log("wcsRecord.isLoadable", wcsRecord.isLoadable);
      return false;
    }

    try {
      const a: Answer = {
        id: 999, //temp
        topicId: Number(topicId),
        answerer: account,
        answer: answer,
        isBestAnswer: 0,
        createdAt: 0, //temp
        updatedAt: 0, //temp
      };
      const res = await fetch(
        `/api/createAnswer?table=${guild?.answerTable}&topic=${topicId}&answerer=${account}&answer=${answer}`
      );
      console.log(res);

      //store data to ceramic
      const { wc, hash } = genWorkCredential(guild, topic, a, chainId);
      console.log({ wc });
      const doc = await selfID.client.dataModel.createTile("WorkCredential", {
        ...wc,
      });
      const wcs = wcsRecord.content?.WorkCredentials ?? [];
      const docUrl = doc.id.toUrl();
      await wcsRecord.set({
        WorkCredentials: [
          ...wcs,
          {
            id: docUrl,
            summary: wc.summary,
            isPayer: wc.isPayer,
            deliverables: wc.deliverables,
            isVerified: true,
            issuedTimestamp: wc.issuedTimestamp,
          },
        ],
      });
      const updatedAnswers: Answer[] = !answers ? [a] : [...answers, a];
      setAnswers(updatedAnswers);
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
      `SELECT * FROM ${answerTable} where topicId = ${Number(topicId)};`
    );
    const a = resultsToObjects(answerResults) as Answer[];
    setAnswers(a);
    return a;
  };

  const genWorkCredential = (
    guild: Guild,
    topic: Topic,
    answer: Answer,
    networkId: number
  ): {
    wc: WorkCredential;
    hash: string;
  } => {
    const summary = `Answered to Community Question of ${guild.name} `;
    const detail = `Question: ${topic.topic} \n Answer: ${answer.answer}`;
    const now = convertDateToTimestampStr(new Date());
    const deliverables: DeliverableItem[] = [
      {
        format: "url",
        value: `https://dfaq.vercel.app/${guild.name}/topic/${topic.id}`,
      },
    ];

    const hash = genDeliverableHash(now, summary, detail, deliverables);

    const wc: WorkCredential = {
      to: topic.issuer.toLowerCase(),
      from: answer.answerer.toLowerCase(),
      isPayer: false,
      summary,
      detail,
      deliverables,
      value: "0",
      tokenSymbol: "",
      tokenDecimal: 18,
      networkId,
      jobType: "OneTime",
      deliverableHash: hash,
      issuedTimestamp: now,
      platform: "dfaq",
      relatedAddresses: [],
    };
    return { wc, hash };
  };

  return {
    topic,
    answers,
    topicLoading,
    answerLoading,
    createAnswer,
  };
};
