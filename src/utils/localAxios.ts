import axios from "axios";
import type * as E from "@/interfaceApi/backend";

//@ts-ignore
const currentEnv = import.meta.env.MODE;
axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded";

//@ts-ignore
if(currentEnv != "production"){
    axios.defaults.baseURL = "http://localhost:10010";
}else{
    axios.defaults.baseURL = "http://localhost:10010";
}


export class ChatInfoController{
    public static send(chatinfo: E.ChatInfo){
        return axios.post("/userinfo/chatInfo/insert", chatinfo) 
    }

    public static getRecentMsg(userid:string, time: number, skip: number){
        return axios.post(`/userinfo/chatInfo/recent/${userid}/${time}/${skip}`);
    }

    public static getRecentSendMsg(userid:string, time: number, skip: number){
        return axios.post(`/userinfo/chatInfo/send/${userid}/${time}/${skip}`);
    }

    public static getRecentRevMsg(userid:string, time: number, skip: number){
        return axios.post(`/userinfo/chatInfo/rev/${userid}/${time}/${skip}`);
    }

    public static getDialogMsg(userid:string, targetid: string, time: number, skip: number){
        return axios.post(`/userinfo/chatInfo/dialog/${userid}/${targetid}/${time}/${skip}`);
    }

    public static recivedMsg(chatInfo: E.ChatInfo){
        return axios.post("/userinfo/chatInfo", chatInfo);
    }
}


export class CollectionController{

    public static getOne(userid: string, noteid: string){
       return axios.get(`/userinfo/collection/${userid}/${noteid}`);
    }

    public static insertOne(collection: E.Collection){
        return axios.post("/userinfo/collection/insert", collection);
    }

    public static deleteOne(noteid: string, userid: string){
        return axios.post(`/userinfo/collection/delete/${userid}/${noteid}`);
    }

    public static getCollectionNu(userid: string){
        return axios.get(`/userinfo/collection/${userid}`);
    }

    public static getCollection(userid: string, skip: number){
        return axios.post(`/userinfo/collection/${userid}/${skip}`);
    }
}

export class EditModelController{
    public static insertOne(editModel: E.EditModel){
        return axios.post("/userinfo/editModel/insert", editModel);
    }

    public static updateOne(editModel: E.EditModel){
        return axios.post("/userinfo/editModel", editModel);
    }

    public static deleteOne(userid: string, name: string){
        return axios.post(`/userinfo/editModel/delete/${userid}/${name}`);
    }


    public static getAll(userid: string, skip: number){
       return axios.post(`/userinfo/editModel/user/${userid}/${skip}`);
    }

    public static search(kw: string, skip: number){
        return axios.post(`/userinfo/editModel/search/${kw}/${skip}`);
    }
}


export class TokenInfoController {
    public static getToken(userinfo: E.UserInfo){
        return axios.post(`/userinfo/tokeninfo`, userinfo);
    }

    public static getUserInfo(tokenInfo: E.TokenInfo){
        return axios.post("/userinfo/tokenInfo/token", tokenInfo);
    }
}

export class UserInfoController {
    public static registerUser(userinfo: E.UserInfo){
        return axios.post("/userinfo/userinfo/insert", userinfo);
    }

    public static deleteUser(userid: string){
        return axios.post(`/userinfo/userinfo/delete/userid/${userid}`);
    }

    public static getOneByName(username: string){
        return axios.post(`/userinfo/userinfo/username/${username}`);
    }    
    public static getOneById(userid: string){
        return axios.post(`/userinfo/userinfo/userid/${userid}`);
    }

    public static check(username: string|null, password: string, email: string|null){
        return axios.post("/userinfo/userinfo/check", {username, password, email});
    }
}

export class WatchInfoController{
    public static getOne(sourceid: string, targetid: string){
        return axios.get(`/userinfo/watch/${sourceid}/${targetid}`);
    }

    public static getWatched(userid: string, skip: number){
        return axios.post(`/userinfo/watch/${userid}/${skip}`);
    }

    public static getWatchedNu(userid: string){
        return axios.get(`/userinfo/watch/${userid}`);
    }

    public static getBeWatch(userid: string, skip: number){
        return axios.post(`/userinfo/watch/by/${userid}/${skip}`);
    }

    public static getByWatchedNu(userid: string){
        return axios.get(`/userinfo/watch/by/${userid}`);
    }

    public static insertOne(watch: E.Watch){
        return axios.post(`/userinfo/watch/insert`, watch);
    }

    public static deleteOne(userid:string, targetid:string){
        return axios.post(`/userinfo/watch/delete/${userid}/${targetid}`); 
    }
}

export class DiscussController{
    public static insertOne(discuss: E.Discuss){
        return axios.post("/article/discuss/insert",discuss);
    }

    // public static deleteOne(userid:string, noteid:string, createTime:number){
    //     return axios.delete(`/userinfo/watch/${userid}/${noteid}/${createTime}`);
    // }

    public static getAll(noteid: string){
        return axios.post(`/article/discuss/${noteid}`);
    }
    
}


export class GoodController{
    public static getAll(noteid: string){
        return axios.get(`/article/good/${noteid}`);
    }

    public static insertOne(good: E.Good){
        return axios.post(`/article/good/insert`, good);
    }

    public static deleteOne(noteid: string, userid: string){
        return axios.post(`/article/good/delete/${noteid}/${userid}`);
    }

    public static getOne(noteid: string, userid: string){
        return axios.get(`/article/good/${noteid}/${userid}`);
    }
}


export class NoteInfoController{
    public static rename(notename: string, noteid: string){
        return axios.post(`/article/noteInfo/rename/${notename}/${noteid}`);
    }

    public static getOne(noteid: string){
        return axios.post(`/article/noteInfo/one/${noteid}`);
    }

    public static getOneByFull(username: string, bookname: string, notename: string){
        return axios.post(`/article/noteInfo/${username}/${bookname}/${notename}`);
    }

    public static getAll(username: string, bookname: string){
        return axios.post(`/article/noteInfo/${username}/${bookname}`);
    }

    public static insertOne(noteInfo: E.NoteInfo){
        return axios.post(`/article/noteInfo/insert`, noteInfo);
    }

    public static deleteOne(noteid: string){
        return axios.post(`/article/noteInfo/delete/${noteid}`);
    }

    public static search(kw: string){
        return axios.post(`/article/noteInfo/search/${kw}`);
    }
}

export class StorageInfoController{
    public static getAllById(userid: string){
        return axios.post(`/article/storageInfo/userid/${userid}`);
    }
    public static getAllByName(username: string){
        return axios.post(`/article/storageInfo/${username}`);
    }

    public static insertOne(storageInfo: E.StorageInfo){
        return axios.post(`/article/storageInfo/insert`, storageInfo);
    }

    public static deleteOne(userid: string, bookname: string){
        return axios.post(`/article/storageInfo/delete/${userid}/${bookname}`);
    }

    public static rename(userid:string ,old_name: string, new_name: string){
        return axios.post(`/article/storageInfo/${userid}/${old_name}/${new_name}`);
    }
}

export class ResourceInfoController{
    public static base_url = axios.defaults.baseURL;

    public static updateOne(noteid: string, name: string, content: Blob| File){
        let form = new FormData();
        form.append("file", content);
        return axios.post(`/resource/resourceInfo/update/${noteid}/${name}`, form);
    }

    public static rename(noteid: string, oldname: string, newname: string){
        return axios.post(`/resource/resourceInfo/rename/${noteid}/${oldname}/${newname}`);
    }


    public static uploadData(noteid: string, name: string, content?: Blob| File){
        let form = new FormData();
        if(content!=undefined){
            form.append("file", content);
        }
        return axios.post(`/resource/resourceInfo/insert/${noteid}/${name}`, form);
    }
    public static getAllInfo(noteid: string){
        return axios.post(`/resource/resourceInfo/${noteid}`);
    }

    public static deleteOne(noteid: string, name: string){
        return axios.post(`/resource/resourceInfo/delete/${noteid}/${name}`);
    }

    public static getResourceByid(noteid: string){
        return axios.get(`/static/${noteid}`);
    }

    public static getResourceByName(noteid: string, name: string){
        return axios.get(`/static/${noteid}/${name}`);
    }

    public static findResourceById(username: string, bookname: string, notename: string){
        return axios.get(`/static/${username}/${bookname}/${notename}`);
    }

    // public static findByFullName(username: string, bookname: string, notename: string, name: string){
    //     return axios.get(`/static/${username}/${bookname}/${notename}/${name}`);
    // }

    public static findTextByFullName(username: string, bookname: string, notename: string, name: string){
        return axios.get(`/static/${username}/${bookname}/${notename}/${name}`);
    }

    public static findImageByName(username: string, bookname: string, notename: string, name: string){
        return axios.get(`/static/image/${username}/${bookname}/${notename}/${name}`);
    }

    public static downland(file_name: string ,data: Blob){
        const down = document.createElement('a');
        down.download = file_name;
        down.style.display = 'none';//隐藏,没必要展示出来
        down.href = URL.createObjectURL(data);
        document.body.appendChild(down);
        down.click();
        URL.revokeObjectURL(down.href); // 释放URL 对象
        document.body.removeChild(down);//下载完成移除
    }
}
