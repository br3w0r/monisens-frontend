// Composables
import { createRouter, createWebHistory } from "vue-router";
import { useAppStore } from "../store/app";

const routes = [
  {
    path: "/",
    redirect: "/favourites",
    children: [
      {
        path: "favourites",
        component: () => import("@/views/Favourites.vue"),
      },
      {
        path: "device/:id",
        component: () => import("@/views/Device.vue"),
        beforeEnter: (to: any) => {
          let appStore = useAppStore();
          
          appStore.device_panel.device(to.params.id)
        },
      },
    ]
  },
  {
    path: "/new-device",
    component: () => import("@/views/NewDevice.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
