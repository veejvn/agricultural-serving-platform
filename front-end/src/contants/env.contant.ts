import _ from "lodash";

function getEnvValue(name: string, defaultValue = "") {
  const env = process.env;
  return _.get(env, name, defaultValue);
}

const env = {
  serverUrl: getEnvValue("NEXT_PUBLIC_SERVER_URL", "http://localhost:8080"),
  interval_refresh_token:
    _.toNumber(getEnvValue("NEXT_PUBLIC_INTERVAL_REFRESHTOKEN", "3600")) * 1000 * 0.9,
};

export default env;
