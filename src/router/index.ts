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
        redirect: (to: any) => {
          return { path: "/device/" + to.params.id + "/graphs" };
        },
        component: () => import("@/views/device/Device.vue"),
        beforeEnter: (to: any) => {
          let appStore = useAppStore();

          appStore.controller.device(to.params.id);
        },
        children: [
          {
            path: "graphs",
            component: () => import("@/views/device/GraphPanel.vue"),
          },
          {
            path: "control",
            component: () => import("@/views/device/ControlPanel.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/new-device",
    component: () => import("@/views/new_device/NewDevice.vue"),
  },
];

const router = createRouter({
  history: createWebHistory("/app/"),
  routes,
});

export default router;
