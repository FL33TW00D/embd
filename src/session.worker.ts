import * as embd from "embd-webgpu";
import * as Comlink from "comlink";
import { Result } from "true-myth";
import { AvailableModels, Model } from "./models";
import ModelDB from "./db/modelDB";

export class Session {
    embdSession: embd.Session | undefined;

    public async initSession(
        selectedModel: AvailableModels,
        onProgress: (progress: number) => void
    ): Promise<Result<void, Error>> {
        if (this.embdSession) {
            return Result.err(
                new Error(
                    "Session already initialized. Call `destroy()` first."
                )
            );
        }
        const modelResult = await this.loadModel(selectedModel, onProgress);
        if (modelResult.isErr) {
            return Result.err(modelResult.error);
        }
        const model = modelResult.value;
        await embd.default();
        const builder = new embd.SessionBuilder();
        const session = await builder
            .setModel(model.data)
            .setTokenizer(model.tokenizer)
            .build();
        this.embdSession = session;
        return Result.ok(undefined);
    }

    private async loadModel(
        selectedModel: AvailableModels,
        onProgress: (progress: number) => void
    ): Promise<Result<Model, Error>> {
        const db = await ModelDB.create(); //TODO: don't create a new db every time
        const dbResult = await db.getModel(selectedModel, onProgress);
        if (dbResult.isErr) {
            return Result.err(
                new Error(
                    `Failed to load model ${selectedModel} with error: ${dbResult.error}`
                )
            );
        }
        const dbModel = dbResult.value;

        const modelResult = await Model.fromDBModel(dbModel, db);

        if (modelResult.isErr) {
            return Result.err(
                new Error(
                    `Failed to transmute model ${selectedModel} with error: ${modelResult.error}`
                )
            );
        }
        const model = modelResult.value;
        return Result.ok(model);
    }

    public async run(
        batch: string[],
        options: any 
    ): Promise<Result<any, Error>> {
        if (!this.embdSession) {
            return Result.err(
                new Error(
                    "The session is not initialized. Call `initSession()` method first."
                )
            );
        }

        return Result.ok(await this.embdSession.run(batch, options));
    }
}

if (typeof self !== "undefined") {
    Comlink.expose(Session);
}

