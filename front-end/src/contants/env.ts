import _ from "lodash";

const env = {
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080",
  interval_refresh_token:
    _.toNumber(process.env.NEXT_PUBLIC_INTERVAL_REFRESHTOKEN || "3600") * 1000 * 0.9,
};

export default env;
