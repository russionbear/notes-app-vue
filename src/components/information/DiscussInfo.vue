<script setup lang="ts">

import type {Discuss} from "@/interfaceApi/backend";

defineProps<{
  discuss: Discuss;
}>();
 

</script>

<template>
  <el-card class="box-card" shadow="hover">
    <div class="card-container">
      <span class="card-username">{{discuss.username}}</span>：<span class="card-msg" text>{{discuss.value}}</span>
      </div>
  </el-card>
</template>

<style scoped>
.card-username{
  font-weight: bold;
}
.card-msg{
  word-wrap: break-word;
}

.box-card{
  border: none;
}

.card-container{
  display: flex;
  flex-direction: row;
  justify-content:flex-start;
  align-items: center;
  gap: 5px;
}

.card-container > time{
  font-size: smaller;
  white-space: nowrap;
}
</style>
