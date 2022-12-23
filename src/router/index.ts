import { createRouter, createWebHashHistory } from "vue-router";


/**
 * VISIT_ROUTERS and EDIT_ROUTERS
 * thire first child 's path should be full path
 */

const VISIT_ROUTERS: Array<{path: string, name: string, title?: string, component: any, meta?: {keepAlive?: boolean}}> = [
  {
    path: "/visit/index",
    name: "visit_index",
    title: "index",
    component: 'IndexView'
  },
  {
    path: "about",
    name: "visit_about",
    title: "about",
    component: 'AboutView'
  },
  {
    path: "article",
    name: "visit_article",
    title: undefined,
    component: "ArticleView"
  },
  {
    path: "login",
    name: "visit_login",
    title: 'login',
    component: "LoginView"
  },
  {
    path: "noteList",
    name: "visit_noteList",
    title: undefined,
    component: "NoteListView"
  },
  {
    path: "selfPage",
    name: "visit_selfPage",
    component: "SelfPageView",
  }
]

const EDIT_ROUTERS: Array<{path: string, name: string, title?: string, component: string, meta?: {keepAlive?: boolean}}> = [
  {
    path: "/edit/noteEdit",
    name: "edit_noteEdit",
    component: "NoteEditView",
    meta: {keepAlive: true},
    title: "edit"
  },
  {
    path: "chatList",
    name: "edit_chatList",
    title: "chatList",
    component: "ChatListView",
  },
  {
    path: "collection",
    name: "edit_collection",
    title: "collection",
    component: "CollectionListView",
  },
  {
    path: "editModelList",
    name: "edit_editModelList",
    title: "editModelList",
    component: "EditModelListView",
  },
  {
    path: "watchList",
    name: "edit_watchList",
    title: "watchList",
    component: "WatchListView",
  }
]

const router = createRouter({
  //@ts-ignore
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/visit",
      name: "visit",
      component: () => import("@/views/VisitLayoutView.vue"),
      children: [
        ...VISIT_ROUTERS.map(item => ({
          path: item.path,
          name: item.name,
          component: () => import(`@/views/VisitView/${item.component}.vue`),
          meta: item.meta
        })),
        {
          path: "",
          redirect: VISIT_ROUTERS[0].path
        }
      ]
    }, {
      path: "/edit",
      name: "edit",
      component: () => import("@/views/EditLayoutView.vue"),
      children: [
        ...EDIT_ROUTERS.map(item => ({
          path: item.path,
          name: item.name,
          component: ()=> import(`@/views/EditView/${item.component}.vue`),
          meta: item.meta
        })),
        {
          path: "",
          redirect: EDIT_ROUTERS[0].path
        }
      ]
    },
    {
      path: "",
      redirect: "/visit"
    }
  ],
});

export default router;

export {VISIT_ROUTERS, EDIT_ROUTERS}
