import winkNLP, { type ItsFunction } from "wink-nlp";
import model from "wink-eng-lite-web-model";

export const nlp = winkNLP(model);
export const its = nlp.its;
export const as = nlp.as;

// wink-nlp's shipped types declare its.lemma/its.stem with a 3-arg
// signature (index, rdd, addons) that doesn't structurally match the
// 4-arg TokenItsFunction shape .out()/.filter() expect - a type-only
// mismatch, not a runtime one. Recast once here instead of at every
// call site.
export const itsLemma = its.lemma as unknown as ItsFunction<string>;
