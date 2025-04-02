import { createRouter, createWebHistory } from "vue-router";
import Login from "@/components/Login.vue";
import Signup from "@/components/Signup.vue";
import FoodList from "@/components/FoodList.vue";

const routes = [
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/", component: FoodList },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;