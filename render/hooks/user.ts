import { getLocalUser, USER_KEY, type UserInfo } from "@/shared/storage";
import config from "@/urodele.config";
import { Octokit } from "octokit";
import { computed, onMounted, ref } from "vue";


const useUserStorage = () => {
  const _user = ref(getLocalUser())
  const user = computed({
    get: () => _user.value,
    set: (v: Partial<UserInfo> | undefined) => {
      if (v === undefined) {
        localStorage.removeItem(USER_KEY)
        _user.value = undefined
        return
      }
      _user.value = { ..._user.value, ...v } as UserInfo
      localStorage.setItem(USER_KEY, JSON.stringify(_user.value))
    }
  })
  const update = async (newToken?: string) => {
    const token = (() => {
      if (newToken) {
        return newToken
      }
      _user.value = getLocalUser()
      if (_user.value === undefined) return
      return _user.value.token
    })()
    if (!token) return
    try {
      const oc = new Octokit({ auth: token });
      const { data } = await oc.request('GET /user');
      const { data: repo } = await oc.request('GET /repos/{owner}/{repo}', {
        owner: data.login,
        repo: config.github.repo
      })
        .catch((error) => {
          console.error(error)
          return {
            data: {
              permissions: {}
            }
          }
        })
      user.value = {
        name: data.name as string,
        login: data.login,
        avatar: data.avatar_url,
        token,
        permissons: repo.permissions
      };
    } catch (error) {
      if ((error as any).status === 401) {
        console.error(error)
        // unauthorized
        user.value = undefined
        return
      }
      throw error
    }
  }
  return [user, update] as const
}

export const useUser = (() => {
  const [user, update] = useUserStorage()
  const isLogin = computed(() => Boolean(user.value))

  const logout = () => {
    user.value = undefined
  }

  const login = (token: string) => {
    return update(token)
  }

  const canEdit = computed(() => user.value?.permissons.push === true)

  let runed = false;
  return () => {
    if (!runed) {
      runed = true;
      onMounted(() => {
        update()
      });
    }
    return {
      isLogin,
      user,
      logout,
      login,
      canEdit
    };
  };
})();
