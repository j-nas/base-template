import { type RouterOutputs } from "../utils/api";

export type Unpacked<T> = T extends (infer U)[] ? U : T;

export type ImageAdmin = Unpacked<RouterOutputs["image"]["getAllImages"]>;

