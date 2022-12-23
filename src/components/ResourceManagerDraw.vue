<template>
    <el-drawer v-model="visible" :show-close="false" :size="isPhone?'80%':''">
        <div class="body">
            <el-scrollbar height="500px">
                <div class="container">
                    <resource-info-vue @delete="handle_delete" @rename="handle_open_rename" @downland="handle_downland"
                        v-for="item in storages" :resource-info="item"></resource-info-vue>
                </div>
            </el-scrollbar>
            <el-space>
                <el-input v-model="new_name" placeholder="resource name"></el-input>
            </el-space>
            <el-upload class="upload" drag :before-upload="handle_upload"
                >
                <div>
                    Drop file here or <em>click to upload</em>
                </div>
            </el-upload>
        </div>
        <el-dialog v-model="rename_visible" align-center>
            <el-space wrap>
                <span>rename</span>
                <el-input v-model="rename_input_value" @change="handle_rename" />
            </el-space>
        </el-dialog>
    </el-drawer>
</template>
  
<script lang="ts" setup>
import ResourceInfoVue from '@/components/information/ResourceInfo.vue';
import { ResourceInfo } from '@/interfaceApi/backend';
import { ResourceInfoController } from '@/utils/localAxios';
import type { UploadRawFile, UploadRequestOptions } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { IMAGE_FORMATS, VIDEO_FORMATS } from '@/utils/dataFormat';
import { isPhone } from '@/config/generalConfig';

// const props = defineProps<{
//     noteid: string,
// }>()

const visible = ref(true);
const router = useRouter();

const noteid = ref("");

const storages = reactive([...Array(0).keys()].map(item => {
    const tmpInfo = new ResourceInfo();
    tmpInfo.bookname = " bookname";
    tmpInfo.name = "name";
    return tmpInfo;
}))


const refresh = (noteid_: string) => {
    if(noteid_==""){
        storages.splice(0, storages.length);
        noteid.value = "";
        return;
    }
    noteid.value = noteid_;
    ResourceInfoController.getAllInfo(noteid_).then(response=>{
        storages.splice(0, storages.length, ...response.data.filter((item: ResourceInfo)=>item.name!="__content__"));
    })
    // console.log(props.noteid);
}

defineExpose({
    visible,
    refresh
})

// onMounted(() => {
//     refresh(props.noteid);
//     // let splited = router.currentRoute.value.path.split('?');
//     // if (splited.length == 1) {
//     //     return;
//     // }
//     // console.log(splited[1]);
// })

const rename_visible = ref(false);
const rename_input_value = ref("");
const rename_old_value = ref("");

const handle_delete = (resourceInfo: ResourceInfo) => {
    ResourceInfoController.deleteOne(noteid.value, resourceInfo.name as string).then(response=>{
        if(response.data=="1"){
            storages.splice(storages.findIndex(item=>item.name==resourceInfo.name), 1);
        }
    });
}

const handle_open_rename = (resourceInfo: ResourceInfo) => {
    rename_old_value.value = resourceInfo.name as string;
    rename_input_value.value = resourceInfo.name as string;
    rename_visible.value = true;
}

const handle_rename = ()=>{
    if(rename_input_value.value.replaceAll(" ", "").length==0||storages.findIndex(item=>item.name==rename_input_value.value)!=-1){
        return;
    }

    if(rename_input_value.value==="__content__"){
        return;
    }

    ResourceInfoController.rename(noteid.value, rename_old_value.value, rename_input_value.value).then(response=>{
        if(response.data=="1"){
            rename_visible.value = false;
            (storages.find(item=>item.name==rename_old_value.value) as ResourceInfo).name = rename_input_value.value as string;
        }
    });
}


const handle_downland = (resourceInfo: ResourceInfo) => {
    // if(['png', 'jpeg', '.gif'].indexOf(resourceInfo.type)
    // ResourceInfoController.downland(resourceInfo.name,)
    if(IMAGE_FORMATS.indexOf(resourceInfo.type as string)!=-1){
        window.location.href = ResourceInfoController.base_url + `/static/image/${resourceInfo.username}/${resourceInfo.bookname}/${resourceInfo.notename}/${resourceInfo.name}`
    }
    else if(VIDEO_FORMATS.indexOf(resourceInfo.type as string)!=-1){
        window.location.href = ResourceInfoController.base_url + `/static/video/${resourceInfo.username}/${resourceInfo.bookname}/${resourceInfo.notename}/${resourceInfo.name}`
    }else{
        window.location.href = ResourceInfoController.base_url + `/static/${resourceInfo.username}/${resourceInfo.bookname}/${resourceInfo.notename}/${resourceInfo.name}`
    }
}

//----------------------------------------------------------------

const new_name = ref("");
const new_content = ref("");
const new_upload_list = reactive([]);
const isloading = ref(false);

// XMLHttpRequest | Promise<unknown> 
const handle_upload = (rawFile: UploadRawFile) => {

    if(isloading.value){
        return;
    }
    console.log(rawFile)
    let tmp_new_name = new_name.value;
    if(new_name.value.replaceAll(" ", "").length==0||storages.findIndex(item=>item.name==new_name.value)!=-1){
        if(storages.findIndex(item=>item.name==rawFile.name)!=-1){
            tmp_new_name = rawFile.name +"-"+ (new Date()).getTime();
        }else{
            tmp_new_name = rawFile.name;
        }
    }
    if(noteid.value==undefined){
        return;
    }

    isloading.value = true;
    
    ResourceInfoController.uploadData(noteid.value, tmp_new_name, rawFile).then(response=>{
        console.log(response.data)
        if(response.data !=null){
            storages.push(response.data);
        }
    }).finally(()=>{
        isloading.value = false;
    })
    return false;
}

</script>
  
<style scoped>
.body {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
}

.container {
    display: flex;
    align-items: center;
    align-self: center;
    margin: 10px;
    gap: 10px;
    flex-direction: column;
    justify-items: center;

    width: 100%;
}

.container>* {
    width: 100%;
}

.upload {
    width: 200px;
    height: 50px;
    background-color: aqua;
}
</style>
    