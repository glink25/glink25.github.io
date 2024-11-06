import { onMounted, ref } from "vue";

export const useUser = () => {
  const token = ref("");
  const user = ref<{ name: string; avatar: string }>();
  onMounted(() => {
    token.value = localStorage.getItem("github_token") ?? "";
  });
  const isLogin = Boolean(token.value);

  return {
    token,
    isLogin,
    user,
  };
};
