import apiCode from "@/contants/apiCode.contant";

export default function useMessageByApiCode() {
  const codeMap = apiCode as Record<string, string>;
  return function (key: string) {
    if (!codeMap[key]) {
      console.log(`useMessageByApiCode :: key :: ${key} :: notfound`);
    }
    return codeMap[key] || "No code";
  };
}
