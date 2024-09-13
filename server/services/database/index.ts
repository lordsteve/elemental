import Datatype from "./datatypes";
import QueryBuilder from "./queryBuilder";
import Service from "./service";

export { default as Datatype } from "./datatypes";
export { default as QueryBuilder } from "./queryBuilder";
export { default as Service } from "./service";

const Database = { Service, QueryBuilder, Datatype };
export default Database;