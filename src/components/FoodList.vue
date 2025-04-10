<template>
    <div class="w-full">
        <!-- 固定部分 -->
        <div class="fixed top-0 left-0 right-0 bg-secondary z-40 pt-19 text-sm">
            <div class="flex items-center justify-between flex-column md:flex-row flex-wrap pt-1 pb-4 px-6">
                <div class="text-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-7">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                    </svg>
                </div>
                <a href="#" @click.prevent="isCreateModalOpen = true"
                    class="font-medium text-white bg-accent py-2 px-5 rounded-full flex items-center justify-center">
                    追加
                </a>
            </div>

            <ul class="w-full bg-white px-6 rounded-t-xl">
                <!-- 見出し部分 -->
                <li class="overflow-hidden bg-white">
                    <div class="flex w-[calc(100%+80px)]">
                        <div
                            class="h-12 flex w-full items-center font-semibold text-stone-600 border-b border-gray-200 bg-white">
                            <div class="w-[10%]"></div>
                            <span class="w-[60%] text-left">食品名</span>
                            <span class="w-[30%] text-left">期限</span>
                        </div>
                        <!-- 空の削除ボタン分スペース -->
                        <div class="w-20"></div>
                    </div>
                </li>
            </ul>
        </div>

        <!-- 一覧リスト -->
        <div class="pt-44 text-sm">
            <ul class="w-full bg-white pt-1 px-6">
                <!-- 食品リスト -->
                <li v-for="food in foods" :key="food.id" class="overflow-hidden bg-white">
                    <div class="flex w-[calc(100%+80px)] transition-transform duration-200"
                        :style="{ transform: `translateX(${swipePositions[food.id] || 0}px)` }"
                        @touchstart="startSwipe($event, food.id)" @touchmove="swipeItem($event, food.id)"
                        @touchend="endSwipe(food.id)">
                        <!-- 本体部分 -->
                        <div class="flex w-full items-center py-3 border-b border-gray-200 bg-white"
                            @click="openEditModal(food)">
                            <div class="w-[10%] flex justify-start">
                                <div class="h-2.5 w-2.5 rounded-full" :class="getStatusColor(food.expiry_date)"></div>
                            </div>
                            <span class="w-[60%] font-medium text-stone-900 text-left">{{ food.name }}</span>
                            <span class="w-[30%] font-medium text-stone-900 text-left">{{ food.expiry_date }}</span>
                        </div>

                        <!-- 削除ボタン -->
                        <button @click.stop="deleteFood(food.id)"
                            class="w-20 bg-red-500 text-white flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="size-6">
                                <path fill-rule="evenodd"
                                    d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </li>
            </ul>
        </div>

        <!-- 食品登録モーダル -->
        <CreateFoodModal :isCreateModalOpen="isCreateModalOpen" :formData="formData" @close="closeModal"
            @save-food="saveFood" />

        <!-- 食品編集モーダル -->
        <EditFoodModal :isEditModalOpen="isEditModalOpen" :foodToEdit="foodToEdit" @close="closeModal"
            @save-food="saveFood" />
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

// スワイプ用
const swipePositions = ref({})
const startX = ref(0)

function startSwipe(event, id) {
    startX.value = event.touches[0].clientX
}

function swipeItem(event, id) {
    const moveX = event.touches[0].clientX - startX.value
    swipePositions.value[id] = Math.max(-80, Math.min(0, moveX))
}

function endSwipe(id) {
    if (swipePositions.value[id] < -40) {
        swipePositions.value[id] = -80
    } else {
        swipePositions.value[id] = 0
    }
}

// 削除処理
const deleteFood = async (id) => {
    try {
        const { error } = await supabase
            .from('foods')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('削除エラー:', error.message);
        } else {
            console.log('削除成功:');
            fetchFoods();
        }
    } catch (err) {
        console.error('予期しないエラー:', err);
    }
};
</script>

<style scoped></style>