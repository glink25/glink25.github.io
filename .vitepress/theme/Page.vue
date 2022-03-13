<script lang="ts" setup></script>
<template>
  <div class="page">
    <div class="page-content">
      <Content />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  .header-img {
    max-width: 800px;
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  &-content {
    padding: 10px;
    max-width: 800px;
    width: calc(100% - 20px);
    ::v-deep(div) {
      div {
        p:first-child {
          img {
            height: 200px;
            object-fit: cover;
          }
        }
      }
      img {
        width: 100%;
      }
    }
  }
}
</style>
