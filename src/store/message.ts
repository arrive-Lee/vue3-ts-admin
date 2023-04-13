import { defineStore } from "pinia";
import { StoreName } from "./store";
import { reactive, ref } from "vue";
import { getMessage } from "../util/api";
export const useMessageStore = defineStore(StoreName.MESSAGE, () => {
  //未读消息的数目
  const unReadNum = ref<number>(0);
  getMessage().then((response: any) => {
    if (response) {
      const {
        data: {
          data: { unRead },
        },
      } = response;
      unReadNum.value = unRead.length;
    }
  });
  return {
    unReadNum,
  };
});
