import env from "@/contants/env";

const SERVER_URL = {
  API: `${env.serverUrl}/api`,
  AUTH: `${env.serverUrl}/auth`,
  //OAUTH2_GOOGLE: `${env.serverUrl}/oauth2/authorization/google`,
};

export { SERVER_URL };
