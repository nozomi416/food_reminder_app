<template>
    <div class="w-full">
        <!-- ソートボタン -->
        <div class="flex items-center justify-between flex-column md:flex-row flex-wrap pt-2 pb-3 bg-white">
            <div>
                <div style="display: none;">
                    <button id="dropdownActionButton" data-dropdown-toggle="dropdownAction"
                        class="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5"
                        type="button">
                        <span class="sr-only">Action button</span>
                        Action
                        <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                </div>
                <!-- Dropdown menu -->
                <div id="dropdownAction"
                    class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 ">
                    <ul class="py-1 text-sm text-gray-700" aria-labelledby="dropdownActionButton">
                        <li>
                            <a href="#" class="block px-4 py-2 hover:bg-gray-100">Reward</a>
                        </li>
                        <li>
                            <a href="#" class="block px-4 py-2 hover:bg-gray-100">Promote</a>
                        </li>
                        <li>
                            <a href="#" class="block px-4 py-2 hover:bg-gray-100">Activate
                                account</a>
                        </li>
                    </ul>
                    <div class="py-1">
                        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete
                            User</a>
                    </div>
                </div>
            </div>
            <a href="#" @click.prevent="isModalOpen = true" class="font-medium text-orange-600">追加</a>
        </div>

        <!-- 一覧 -->
        <ul class="w-full text-gray-500">
            <li v-for="food in foods" :key="food.id"
                class="flex justify-between items-center bg-white py-3 border-b border-gray-300 last:border-b-0"
                @click="openEditModal(food)">
                <div class="flex items-center space-x-4">
                    <div class="h-2.5 w-2.5 rounded-full" :class="getStatusColor(food.expiry_date)"></div>
                    <span class="font-semibold text-gray-900">{{ food.name }}</span>
                </div>
                <span class="font-semibold text-gray-900">{{ food.expiry_date }}</span>
            </li>
        </ul>

        <!-- 食品登録モーダル -->
        <div v-if="isModalOpen" id="createFoodModal" tabindex="-1" aria-hidden="true"
            class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 md:inset-0 h-[calc(100%-1rem)]">
            <div class="relative w-full max-w-2xl max-h-full">
                <form @submit.prevent="createFood" class="relative bg-white rounded-lg shadow-sm">
                    <!-- ヘッダー -->
                    <div class="flex items-start justify-between p-4 border-b rounded-t border-gray-200">
                        <h3 class="text-xl font-semibold text-gray-900">
                            食品登録
                        </h3>
                        <button type="button" @click="isModalOpen = false"
                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>

                    <!-- 内容 -->
                    <div class="p-6 space-y-6">
                        <div class="grid grid-cols-6 gap-6">
                            <div class="col-span-6 sm:col-span-3">
                                <label for="name" class="block mb-2 text-sm font-medium text-gray-900">
                                    食品名
                                </label>
                                <input v-model="formData.name" type="text" name="name" id="name"
                                    class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                    placeholder="例） たまご" required>
                            </div>
                            <div class="col-span-6 sm:col-span-3">
                                <label for="expiry_date" class="block mb-2 text-sm font-medium text-gray-900">
                                    期限
                                </label>
                                <input v-model="formData.expiry_date" type="date" name="expiry_date" id="expiry_date"
                                    class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                    required>
                            </div>
                            <div class="col-span-6 sm:col-span-3">
                                <label for="purchase_date" class="block mb-2 text-sm font-medium text-gray-900">
                                    購入日
                                </label>
                                <input v-model="formData.purchase_date" type="date" name="purchase_date"
                                    id="purchase_date"
                                    class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5">
                            </div>
                            <div class="col-span-6 sm:col-span-3">
                                <label for="note" class="block mb-2 text-sm font-medium text-gray-900">
                                    メモ
                                </label>
                                <textarea v-model="formData.note" name="note" id="note" rows="4"
                                    class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- フッター -->
                    <div class="flex items-center p-6 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b">
                        <button type="submit"
                            class="ml-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            登録
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- 食品編集・削除モーダル -->
        <div v-if="isEditModalOpen" id="editFoodModal" tabindex="-1" aria-hidden="true"
            class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 md:inset-0 h-[calc(100%-1rem)]">
            <div class="relative w-full max-w-2xl max-h-full">
                <form class="relative bg-white rounded-lg shadow-sm">
                    <!-- ヘッダー -->
                    <div class="flex items-start justify-between p-4 border-b rounded-t border-gray-200">
                        <h3 class="text-xl font-semibold text-gray-900">
                            食品編集
                        </h3>
                        <button type="button" @click="closeModal"
                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>

                    <!-- 内容 -->
                    <div class="p-6 space-y-6">
                        <div class="grid grid-cols-6 gap-6">
                            <div class="col-span-6 sm:col-span-3">
                                <label for="name" class="block mb-2 text-sm font-medium text-gray-900">
                                    食品名
                                </label>
                                <input v-model="foodToEdit.name" type="text" name="name" id="name"
                                    class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                    placeholder="例） たまご" required>
                            </div>
                            <div class="col-span-6 sm:col-span-3">
                                <label for="expiry_date" class="block mb-2 text-sm font-medium text-gray-900">
                                    期限
                                </label>
                                <input v-model="foodToEdit.expiry_date" type="date" name="expiry_date" id="expiry_date"
                                    class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                    required>
                            </div>
                            <div class="col-span-6 sm:col-span-3">
                                <label for="purchase_date" class="block mb-2 text-sm font-medium text-gray-900">
                                    購入日
                                </label>
                                <input v-model="foodToEdit.purchase_date" type="date" name="purchase_date"
                                    id="purchase_date"
                                    class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5">
                            </div>
                            <div class="col-span-6 sm:col-span-3">
                                <label for="note" class="block mb-2 text-sm font-medium text-gray-900">
                                    メモ
                                </label>
                                <textarea v-model="foodToEdit.note" name="note" id="note" rows="4"
                                    class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- フッター -->
                    <div class="flex items-center p-6 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b">
                        <button @click.prevent="deleteFood"
                            class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            削除
                        </button>
                        <button @click.prevent="updateFood"
                            class="ml-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            保存
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import dayjs from "dayjs";
import { ref, reactive, onMounted } from "vue";
import { supabase } from "../supabase";
import { useRouter } from "vue-router";

const router = useRouter();

let user = null;
const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const foodToEdit = ref(null)
const foods = ref([]);
const formData = reactive({
    name: '',
    expiry_date: '',
    purchase_date: '',
    note: '',
    user_id: null
});

onMounted(async () => {
    const { data } = await supabase.auth.getUser();
    console.log("user: ", data.user)
    user = data.user;
    if (user) {
        formData.user_id = user.id;
        fetchFoods();
    } else {
        router.push("/login");
    }
});

const fetchFoods = async () => {
    const { data, error } = await supabase.from("foods").select("*").order("expiry_date", { ascending: true });
    if (error) {
        console.error("データ取得エラー:", error.message);
    } else {
        console.log("foods: ", data)
        foods.value = data;
    }
};

const getStatusColor = (expiryDate) => {
    const today = dayjs();
    const expiry = dayjs(expiryDate);
    const diff = expiry.diff(today, "day");

    if (diff < 0) return "bg-red-500";
    if (diff <= 3) return "bg-amber-400";
    return "bg-green-500";
};

// 編集モーダルを開く
const openEditModal = (food) => {
    foodToEdit.value = { ...food }; // 編集用データを設定
    isEditModalOpen.value = true; // モーダルを表示
    document.body.classList.add('modal-open');
};

// 編集モーダルを閉じる
const closeModal = () => {
    isEditModalOpen.value = false;
    foodToEdit.value = null; // 編集データをクリア
    document.body.classList.remove('modal-open');
};

// 登録処理
const createFood = async () => {
    try {
        if (formData.purchase_date === "") {
            formData.purchase_date = null;
        }

        console.log(formData)
        const { error } = await supabase
            .from('foods')
            .insert([formData]);

        if (error) {
            console.error('データ登録エラー:', error.message);
        } else {
            console.log('登録成功:');
            isModalOpen.value = false;
            fetchFoods();
        }
    } catch (err) {
        console.error('予期しないエラー:', err);
    }
};

// 編集処理
const updateFood = async () => {
    try {
        const { data, error } = await supabase
            .from('foods')
            .update({
                name: foodToEdit.value.name,
                expiry_date: foodToEdit.value.expiry_date,
                purchase_date: foodToEdit.value.purchase_date,
                note: foodToEdit.value.note
            })
            .eq('id', foodToEdit.value.id);

        if (error) {
            console.error('データ更新エラー:', error.message);
        } else {
            console.log('更新成功:', data);
            isEditModalOpen.value = false;
            fetchFoods();
        }
    } catch (err) {
        console.error('予期しないエラー:', err);
    }
};

// 削除処理
const deleteFood = async () => {
    try {
        if (!foodToEdit.value.id) return;

        const { error } = await supabase
            .from('foods')
            .delete()
            .eq('id', foodToEdit.value.id);

        if (error) {
            console.error('削除エラー:', error.message);
        } else {
            console.log('削除成功:');
            isEditModalOpen.value = false;
            fetchFoods();
        }
        // emit('updateList'); // 食品リストを更新（親コンポーネント用）
        // emit('closeModal'); // モーダルを閉じる
    } catch (err) {
        console.error('予期しないエラー:', err);
    }
};
</script>

<style scoped>
.modal-open {
    overflow: hidden;
}
</style>