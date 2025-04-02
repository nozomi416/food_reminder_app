<template>
    <header class="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex items-center justify-between">
                <div class="flex-shrink-0">
                    <h1 class="text-2xl font-semibold">Food Reminder</h1>
                </div>

                <div class="font-medium text-gray-500 dark:text-gray-300">
                    <button @click="logout" class="text-blue-700 dark:text-blue-500">ログアウト</button>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import { supabase } from "../supabase";
import { useRouter } from "vue-router";

export default {
    setup() {
        const router = useRouter();

        // ログアウト処理
        const logout = async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.log(error);
            } else {
                router.push("/login");
            }
        };

        return { logout };
    },
};
</script>

<style scoped>
</style>