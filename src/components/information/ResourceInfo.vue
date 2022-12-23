<script setup lang="ts">
import type { ResourceInfo } from "@/interfaceApi/backend";
import { ElMessage } from "element-plus";
import { IMAGE_FORMATS, VIDEO_FORMATS } from "@/utils/dataFormat";
import { ResourceInfoController } from "@/utils/localAxios";

const props = defineProps<{
  resourceInfo: ResourceInfo;
}>();

const emit = defineEmits<{
  (e: "delete", data: ResourceInfo): void;
  // (e: "upload", data: ResourceInfo): void;
  (e: "downland", data: ResourceInfo): void;
  (e: "rename", data: ResourceInfo): void;
}>();

const handle_copy = () => {
  // if(props.resourceInfo.value!=undefined){
    
  // }
  
    //@ts-ignore
    let value = `/${props.resourceInfo.username}/${props.resourceInfo.bookname}/${props.resourceInfo.notename}/${props.resourceInfo.name}`;
    if(IMAGE_FORMATS.indexOf(props.resourceInfo.type as string)!=-1){
      value = '/image'+value;
    }else if(VIDEO_FORMATS.indexOf(props.resourceInfo.type as string)!=-1){
      value = '/video'+value;
    }
    value  = ResourceInfoController.base_url + "/static" + value;
    navigator.clipboard.writeText(value);
    ElMessage({type: "success", message: "Copy to clipboard"});
}

</script>

<template>
  <el-card class="box-card" shadow="hover">
    <div class="card-container">
      <el-input class="card-input" disabled v-model="resourceInfo.name" placeholder="Please input" size="small" />
      <span>{{resourceInfo.type}}</span>
      <el-dropdown>
      <el-button type="primary" size="small">
          opera
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item><el-button type="primary" size="small" @click="emit('upload', resourceInfo)">upload</el-button></el-dropdown-item> -->
            <!-- <el-dropdown-item><el-button type="primary" size="small" @click="emit('downland', resourceInfo)">downland</el-button></el-dropdown-item> -->
            <el-dropdown-item><el-button type="primary" size="small" @click="emit('rename', resourceInfo)">rename</el-button></el-dropdown-item>
            <el-dropdown-item><el-button size="small" @click="emit('delete', resourceInfo)">delete</el-button></el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button size="small" @click="handle_copy">path</el-button>
    </div>
  </el-card>
</template>

<style scoped>

.box-card {
  border: none;
}

.card-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 5px;

}

.card-container>time {
  font-size: smaller;
  white-space: nowrap;
  ;
}

.card-input{
  width: 120px;
}
</style>
