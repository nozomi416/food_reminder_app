<template>
    <div class="flex justify-center mt-24 px-6">
        <div class="w-full">
            <form class="space-y-6" @submit.prevent="signup">
                <h5 class="text-center text-2xl font-bold text-primary">アカウント登録</h5>
                <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
                <div>
                    <label for="email" class="block mb-2 font-medium text-sm text-stone-900">メールアドレス</label>
                    <input v-model="email" type="email" name="email" id="email"
                        class="bg-gray-50 border border-gray-300 text-stone-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="メールアドレス" required />
                </div>
                <div>
                    <label for="password" class="block mb-2 font-medium text-sm text-stone-900">パスワード</label>
                    <input v-model="password" type="password" name="password" id="password" placeholder="6桁以上の英数字"
                        class="bg-gray-50 border border-gray-300 text-stone-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required />
                </div>
                <button type="submit"
                    class="w-full text-sm text-white bg-primary font-medium rounded-lg mt-1 px-5 py-3 text-center">登録</button>
            </form>
            <div class="font-medium mt-4 flex flex-col gap-1">
                <router-link to="/login" class="text-sm text-center text-stone-400">ログイン画面に戻る</router-link>
            </div>
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