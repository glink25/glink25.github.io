import * as React from "jsx-dom";
import { useDialog } from "../Dialog";
import { useAttrRef, withCreated } from "../../utils/dom";
import { getUserInfo, login, logout, type UserInfo } from "./auth.js";

const Login = () => {
  const createModal = () => {
    const [buttonRef, setButtonRef] = useAttrRef({ disabled: true, "data-loading": false });
    const inputRef = React.useRef<HTMLInputElement>();
    const onInput = () => {
      console.log(inputRef.current?.value, "dsdsd");
      setButtonRef({
        disabled: !inputRef.current?.value.length,
      });
    };
    const toConfirm = async () => {
      const value = inputRef.current?.value;
      if (!value) return;
      setButtonRef({ "data-loading": true });
      try {
        await login(value);
        location.reload();
      } finally {
        setButtonRef({ "data-loading": false });
      }
    };
    return (
      <div class="flex flex-col gap-4 p-4">
        <div>Enter your github token:</div>
        <a
          href="https://github.com/settings/personal-access-tokens/new"
          target="_blank"
          class="text-xs underline text-blue">
          learn here
        </a>
        <input
          ref={inputRef as any}
          type="text"
          placeholder="paste your token here"
          class="rounded border px-2 py-1 text-sm"
          onInput={onInput}
        />
        <button class="buttoned bg-blue" ref={buttonRef} onClick={toConfirm}>
          confirm
        </button>
      </div>
    );
  };
  const dialog = useDialog(createModal);

  const toLogin = () => {
    dialog.show();
  };
  const LoginButton = () => <button onClick={toLogin}>Login</button>;

  return LoginButton();
};

const Profile = (user: UserInfo) => {
  const toLogout = () => {
    logout();
    location.reload();
  };
  const createModal = () => (
    <div class="w-full flex-1 flex flex-col gap-2 p-4 justify-between">
      <div>
        <div class="text-lg">Are you sure to log out?</div>
        <div class="text-gray text-sm">Token will be clear, make sure you saved it elsewhere</div>
      </div>
      <button class="buttoned bg-red" onClick={toLogout}>
        log out
      </button>
    </div>
  );
  const dialog = useDialog(createModal);
  const toShowProfile = () => {
    dialog.show();
  };
  const canEdit = Boolean(user.permissions?.push)
  const isHome = location.pathname === "/";
  const isPage = location.pathname.startsWith("/post");
  const pageId = location.pathname.replace("/post/", "");
  if (canEdit) {
    document.querySelectorAll('[data-page-draft]').forEach(el => {
      el.setAttribute('data-page-draft', 'verified')
    })
  }
  return (
    <div class="flex gap-2">
      {canEdit && isHome && (
        <a href="/edit?new" class="text-button">
          <div class="i-ri:add-large-line"></div>
        </a>
      )}
      {canEdit && isPage && (
        <a href={`/edit?path=${pageId}`} class="text-button">
          <div class="i-ri:quill-pen-fill"></div>
        </a>
      )}

      <div class="w-6 h-6 rounded-full cursor-pointer" onClick={toShowProfile}>
        <img src={user.avatar} alt="" class="rounded-full" />
      </div>
    </div>
  );
};

const Auth = () => {
  const wrapper = () => {
    const userInfo = getUserInfo();
    if (!userInfo) return Login();
    return Profile(userInfo);
  };
  return wrapper();
};

export const mount = (select: string) => {
  const root = document.querySelector<HTMLDivElement>(select);
  if (!root) return;
  root.appendChild(Auth());
};
