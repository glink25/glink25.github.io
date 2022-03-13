<script lang="ts" setup>
import { useData } from "vitepress";
import { computed } from "vue";
import { CustomThemeConfig } from "./type";
import { formatDate } from "../utils/date";
import GithubIcon from "./assets/icons/github.svg?component";
const props = defineProps<{ currentTab: string }>();
const data = useData<CustomThemeConfig>();
const pages = computed(() =>
  data.site.value.themeConfig.catagories
    ?.find((cat) => cat.title === props.currentTab)
    ?.pages.filter((p) => !p.frontMatter.home && !p.frontMatter.readme)
);
</script>
<template>
  <div class="home">
    <div class="attitude"><span>Glink</span></div>
    <div class="list">
      <a
        v-for="(page, index) in pages"
        :key="index"
        :href="`${page.regularPath}`"
        ><div class="title">{{ page.frontMatter.title }}</div>
        <div class="description">
          {{ page.frontMatter.description ?? "暂无描述" }}
        </div>
        <div class="date">
          {{ formatDate(page.frontMatter.date) }}
        </div>
      </a>
    </div>
    <div class="footer">
      <a class="iconfont github" href="https://github.com/glink25" target="_blank">
        <span>&#xe602</span>
      </a>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.home {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  .attitude {
    width: 100%;
    height: 100px;
    background-color: gray;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      font-size: xx-large;
      color: var(--bg-color);
      font-weight: bolder;
    }
  }
  .list {
    padding: 10px;
    display: flex;
    flex-flow: column nowrap;
    max-width: 800px;
    width: 100%;
    min-height: calc(100vh - 200px);
    a {
      border-bottom: 1px solid var(--border-bottom-color);
      color: var(--primary-color);
      margin: 10px 0;
      padding: 10px 0;
      min-height: 90px;
      text-decoration: none;
      position: relative;
      .title {
        font-weight: bold;
        font-size: large;
        &::after {
          content: "";
          display: block;
          width: 0;
          height: 2px;
          background-color: red;
          transition: all ease-in-out 0.2s;
        }
        &:hover {
          &::after {
            width: 20%;
          }
        }
      }
      .description {
        opacity: 0.4;
      }
      .date {
        position: absolute;
        font-size: 12px;
        bottom: 0;
        right: 0;
        opacity: 0.4;
      }
    }
  }
  .footer {
    .github{
      font-size: 30px;
      text-decoration: none;
      color: var(--primary-color);
    }
  }
}
</style>
