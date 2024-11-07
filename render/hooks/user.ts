import { Octokit } from "octokit";
import { onMounted, ref } from "vue";

export const useUser = (() => {
  const token = ref("");
  const user = ref<{ name: string; avatar: string }>();

  const isLogin = ref(Boolean(token.value));

  let runed = false;
  return () => {
    if (!runed) {
      runed = true;

      onMounted(async () => {
        token.value = localStorage.getItem("github_token") ?? "";
        isLogin.value = Boolean(token.value);
        if (token.value === "") return;
        const oc = new Octokit({ auth: token.value });
        try {
          const { data } = await oc.request({ url: "/user" });
          user.value = {
            name: data.name,
            avatar: data.avatar_url,
          };
          isLogin.value = true;
        } catch (error) {
          if ((error as any).status === 401) {
            // unauthorized
          }
          isLogin.value = false;
        }
      });
    }
    return {
      token,
      isLogin,
      user,
    };
  };
})();
