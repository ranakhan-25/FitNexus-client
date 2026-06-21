import { authClient } from "@/lib/auth-client";

export const getToken = async () => {
  const { data: tokenData } = await authClient.token()
  return tokenData.token;
}