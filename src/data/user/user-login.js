import { useMutation } from "react-query";
import http from "../../api/http";
import { API_ENDPOINTS } from "../../api/endpoints";

export const useLoginMutation = () => {
  return useMutation(({ variables }) => {
    console.log(variables);
    http.get(API_ENDPOINTS.TOKEN, variables);
  });
};
