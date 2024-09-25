import Security from "./security";
import Database from "./database";
import Log from "./log";

export { default as Security } from "./security";
export { default as Database } from "./database";
export { default as Log } from "./log";

const Services = {
    Security,
    Database,
    Log
};
export default Services;