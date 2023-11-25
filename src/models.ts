import { Result } from "true-myth";
import ModelDB from "./db/modelDB";
import { DBModel } from "./db/types";

export enum AvailableModels {
    BAAI_SMALL_EN_v1_5 = "bge-small-en-v1.5",
}

export const ModelSizes: Map<AvailableModels, number> = new Map([
    [AvailableModels.BAAI_SMALL_EN_v1_5, 30000000],
]);

export class Model {
    name: string;
    data: Uint8Array;
    tokenizer: Uint8Array;

    constructor(name: string, data: Uint8Array, tokenizer: Uint8Array) {
        this.name = name;
        this.data = data;
        this.tokenizer = tokenizer;
    }

    static async fromDBModel(
        dbModel: DBModel,
        db: ModelDB
    ): Promise<Result<Model, Error>> {
        const tokenizerResult = await db.getTokenizer(dbModel.ID);
        if (tokenizerResult.isErr) {
            return Result.err(tokenizerResult.error);
        }
        const tokenizerBytes = tokenizerResult.value.bytes;

        return Result.ok(
            new Model(dbModel.name, dbModel.bytes, tokenizerBytes)
        );
    }
}
