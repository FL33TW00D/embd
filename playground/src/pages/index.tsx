import type { NextPage } from "next";
import { useRef, useState } from "react";
import Layout from "../components/layout";
import WebGPUModal from "../components/modal";
import {
    InferenceSession,
    SessionManager,
    AvailableModels,
    initialize,
} from "embd";
import toast from "react-hot-toast";
import { Result } from "true-myth";

const Home: NextPage = () => {
    const session = useRef<InferenceSession | null>(null);
    const [batch, setBatch] = useState<string[]>([]);
    const [embeddings, setEmbeddings] = useState<Float32Array | null>(null);

    const loadModel = async () => {
        if (session.current) {
            session.current.destroy();
        }

        const manager = new SessionManager();
        const loadResult = await manager.loadModel(
            AvailableModels.BAAI_SMALL_EN_v1_5,
            () => {
                console.log("LOADED");
            },
            (p: number) => {
                console.log("PROGRESS", p);
            }
        );
        if (loadResult.isErr) {
            toast.error(loadResult.error.message);
        } else {
            session.current = loadResult.value;
        }
    };

    const runSession = async () => {
        if (!session.current) {
            toast.error("No model loaded");
            return;
        }
        await initialize();
        const embeddingsResult = await session.current.run(batch, {});

        //@ts-ignore
        const [state, data] = embeddingsResult.repr;
        if (state === "Err") {
            return Result.err(
                new Error("Session run failed: " + data.toString())
            );
        }
        const embeddings = data;
        setEmbeddings(embeddings);
    };

    return (
        <Layout title={"EMBD"}>
            <div className="flex flex-col items-center w-full h-full mx-auto gap-y-8">
                <h1> Welcome to EMBD </h1>
                <button onClick={loadModel}>Load Model</button>
                <textarea
                    className="w-1/2 h-1/2 border-2 border-black"
                    onChange={(e) => setBatch(e.target.value.split("\n"))}
                />
                <button onClick={runSession}>Run Session</button>
                <p className="w-96 h-full break-all">
                    {embeddings
                        ?.subarray(0, 64)
                        .toString()
                        .split(",")
                        .join("\n")}
                </p>
            </div>
            <WebGPUModal />
        </Layout>
    );
};

export default Home;
