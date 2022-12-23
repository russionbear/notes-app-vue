import { ref, reactive, watch } from "vue";
import { defineStore } from "pinia";
import type { NoteInfo, StorageInfo } from "@/interfaceApi/backend";

export const useUserInfoStore = defineStore("userinfo", () => {
    const username = ref("");
    const password = ref("");
    const userid = ref("");
    const email = ref("");
    const role = ref("");
    const token = ref("");

    const storages = reactive<Array<StorageInfo>>([]);
    const notelist = reactive<Array<NoteInfo>>([]);
    const current_storage = ref("");
    const current_notename = ref("");
    // const notecontent = ref("");
    // const resourcelist = reactive([]);

    //   const count = ref(0);
    //   const doubleCount = computed(() => count.value * 2);
    //   function increment() {
    //     count.value++;
    //   }

    watch(notelist, (old_v, new_v) => {
        if (new_v.length == 0) {
            current_notename.value = "";
        } else {
            current_notename.value = new_v[0].notename as string;
        }
    })

    return {
        token, userid, username, password, email, role, storages,
        notelist, current_notename, current_storage
    };
});
