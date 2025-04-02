<template>
    <div
        class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form class="space-y-6" @submit.prevent="signup">
            <h5 class="text-center text-xl font-medium text-gray-900 dark:text-white">Food Expiration</h5>
            <h5 class="text-xl font-medium text-gray-900 dark:text-white">新規登録</h5>
            <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
            <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">メールアドレス</label>
                <input v-model="email" type="email" name="email" id="email"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="name@company.com" required />
            </div>
            <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">パスワード</label>
                <input v-model="password" type="password" name="password" id="password" placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required />
            </div>
            <button type="submit"
                class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">登録</button>
        </form>
        <div class="text-sm font-medium text-gray-500 mt-4 dark:text-gray-300 flex flex-col gap-2">
            <router-link to="/" class="text-blue-700 dark:text-blue-500">ログイン画面に戻る</router-link>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { supabase } from "../supabase";

export default {
    setup() {
        const email = ref("");
        const password = ref("");
        const errorMessage = ref("");

        const signup = async () => {
            errorMessage.value = "";
            const { error } = await supabase.auth.signUp({
                email: email.value,
                password: password.value,
            });
            if (error) {
                console.log(error)
                errorMessage.value = "登録に失敗しました。";
            } else {
                alert("登録成功！メールを確認してください。");
            }
        };

        return { email, password, signup, errorMessage };
    },
};
</script>