import { flow, snakeCase, invoke } from "lodash/fp";

/** Converts text to ENVIRONMENT_VARIABLE_CASE */
export const envCase = flow(snakeCase, invoke("toUpperCase"));
