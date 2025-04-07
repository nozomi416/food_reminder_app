<template>
    <div class="w-full">
        <!-- 操作ボタン -->
        <div class="fixed top-0 left-0 right-0 bg-white z-40 px-6 pt-19">
            <div class="flex items-center justify-between flex-column md:flex-row flex-wrap pt-1 pb-3 bg-white">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                    </svg>

                    <div style="display: none;">
                        <button id="dropdownActionButton" data-dropdown-toggle="dropdownAction"
                            class="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5"
                            type="button">
                            <span class="sr-only">Action button</span>
                            Action
                            <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m1 1 4 4 4-4" />
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
                <a href="#" @click.prevent="isCreateModalOpen = true" class="font-medium text-orange-600">追加</a>
            </div>
        </div>

        <!-- 食品登録モーダル -->
        <CreateFoodModal :isCreateModalOpen="isCreateModalOpen" :formData="formData" @close="closeModal"
            @save-food="saveFood" />

        <!-- 食品編集モーダル -->
        <EditFoodModal :isEditModalOpen="isEditModalOpen" :foodToEdit="foodToEdit" @close="closeModal"
            @save-food="saveFood" />

        <!-- 一覧リスト -->
        <ul class="w-full text-sm text-gray-500 mt-30">
            <!-- 見出し部分 -->
            <li class="flex justify-between items-center py-2 font-semibold text-gray-500 border-b border-gray-200">
                <span class="w-[10%] text-left"></span>
                <span class="w-[65%] text-left">食品名</span>
                <span class="w-[25%] text-left">期限</span>
            </li>
            <li v-for="food in foods" :key="food.id"
                class="flex items-center py-3 border-b border-gray-200 last:border-b-0" @click="openEditModal(food)">
                <div class="w-[10%] flex justify-start">
                    <div class="h-2.5 w-2.5 rounded-full" :class="getStatusColor(food.expiry_date)"></div>
                </div>
                <span class="w-[65%] font-medium text-gray-900 text-left">{{ food.name }}</span>
                <span class="w-[25%] font-medium text-gray-900 text-left">{{ food.expiry_date }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import dayjs from "dayjs";
import { ref, reactive, onMounted } from "vue";
import { supabase } from "../supabase";
import { useRouter } from "vue-router";

import CreateFoodModal from './CreateFoodModal.vue';
import EditFoodModal from './EditFoodModal.vue';

const router = useRouter();

let user = null;
const isCreateModalOpen = ref(false);
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
    if (diff < 3) return "bg-amber-400";
    return "bg-green-500";
};

// 編集モーダルを開く
const openEditModal = (food) => {
    foodToEdit.value = { ...food }; // 編集用データを設定
    isEditModalOpen.value = true; // モーダルを表示
};

// モーダルを閉じる
const closeModal = () => {
    // 登録モーダルを閉じる
    if (isCreateModalOpen.value) {
        isCreateModalOpen.value = false;
        // formDataをリセット
        formData.name = '';
        formData.expiry_date = '';
        formData.purchase_date = '';
        formData.note = '';
        formData.user_id = user.id;
    }
    // 編集モーダルを閉じる
    if (isEditModalOpen.value) {
        isEditModalOpen.value = false;
        foodToEdit.value = null;
    }
};

// モーダル保存後の処理
const saveFood = async () => {
    fetchFoods();
    closeModal();
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

<style scoped></style>