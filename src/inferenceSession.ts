import { Session } from "./session.worker";
import * as Comlink from "comlink";
import { Result } from "true-myth";
import { AvailableModels } from "./models";

//User facing API
export class InferenceSession {
    private session: Comlink.Remote<Session> | Session | null;
    private innerWorker: Worker | null; //Keep a reference to the worker so we can terminate it

    constructor(session: Comlink.Remote<Session> | Session, worker?: Worker) {
        this.session = session;
        this.innerWorker = worker || null;
    }

    async initSession(
        selectedModel: AvailableModels,
        onProgress: (progress: number) => void
    ): Promise<Result<void, Error>> {
        return await this.session!.initSession(selectedModel, onProgress);
    }

    public destroy(): void {
        if (this.innerWorker !== null) {
            console.warn("Terminating worker");
            this.innerWorker.terminate();
        }
        this.session = null;
    }
}

