<script setup lang="ts">

import type {EditModel} from "@/interfaceApi/backend";
import { ElMessage } from "element-plus";

const props =  withDefaults(defineProps<{
  editModel: EditModel;
  canEdit: boolean;
}>(), {
  canEdit: false
});
 
const emit = defineEmits<{
  (e: "delete", data: EditModel): void;
  (e: "edit", data: EditModel): void;
}>();

const handle_copy = () => {
  if(props.editModel.value!=undefined){
    navigator.clipboard.writeText(props.editModel.value);
    ElMessage({type: "success", message: "Copy to clipboard"});
  }
}

</script>

<template>
  <el-card class="box-card" shadow="hover">
    <div class="card-container">
        <span>{{editModel.name}}</span>
        <span class="card-dsc">{{editModel.dsc}}</span>
        <time>{{editModel.username}}</time>
        <el-button  type="primary" size="small" @click="handle_copy">copy</el-button>
        <el-button v-if="canEdit" type="primary" size="small" @click="emit('edit', editModel)">edit</el-button>
        <el-button v-if="canEdit" size="small" @click="emit('delete', editModel)">delete</el-button>
      </div>
  </el-card>
</template>

<style scoped>


.box-card{
  border: none;
}

.card-container{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
}

.card-container > span:first-child{
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.card-dsc{
  white-space: normal;
  overflow: initial;
  text-overflow: unset;
}

.card-container > time{
  font-size: smaller;
  white-space: nowrap;
}
</style>
