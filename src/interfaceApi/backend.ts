export class UserInfo{
    userid:string | undefined;
    username:string | undefined;
    password:string | undefined;
    role:string | undefined;
    email:string | undefined;
}

export class Watch{
    targetname:string | undefined;

    userid:string | undefined;
    targetid:string | undefined;
}

export class EditModel{
    username:string | undefined;

    userid:string | undefined;
    name:string | undefined;
    dsc:string | undefined;
    value:string | undefined;
}

export class Collection{

    bookname: string | undefined;
    username:string | undefined;
    notename:string | undefined;

    userid:string | undefined;
    noteid:string | undefined;
}

export class ChatInfo{
    sourcename:string | undefined;
    targetname:string | undefined;
    username: string | undefined;

    sourceid:string | undefined;
    targetid:string | undefined;
    createTime:number | undefined;
    msg:string | undefined;
    got: boolean | undefined;
    isSys: boolean | undefined;
}

export class TokenInfo{
    userid:string | undefined;
    token:string | undefined;
}

// resource

export class ResourceInfo{
    username:string | undefined;
    bookname:string | undefined;
    notename:string | undefined;

    noteid:string | undefined;
    name:string | undefined;
    type:string | undefined;
    createTime:number | undefined;
    value: Blob | undefined;
}

// articles

export class Discuss{
    username:string | undefined;

    userid:string | undefined;
    noteid:string | undefined;
    createTime:number | undefined;
    value:string | undefined;
}

export class Good{
    userid:string | undefined;
    noteid:string | undefined;
}

export class NoteInfo{
    goods: number | undefined;
    collections:number | undefined;
    username:string | undefined;

    userid:string | undefined;
    noteid:string | undefined;
    bookname:string | undefined;
    notename:string | undefined;
    updateTime: number | undefined;
    isPublic: boolean | undefined;
    content:string | undefined;
}

export class StorageInfo{
    username:string | undefined;

    bookname:string | undefined;
    userid:string | undefined;
}


