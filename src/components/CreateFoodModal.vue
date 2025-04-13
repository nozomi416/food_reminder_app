<template>
    <div v-if="isCreateModalOpen" id="createFoodModal" tabindex="-1" aria-hidden="true"
        class="fixed inset-0 z-40 flex items-center justify-center bg-white pt-10">
        <div class="relative w-full h-full">
            <form @submit.prevent="createFood" class="relative">
                <!-- ヘッダー -->
                <div class="flex items-start justify-between px-4 pt-4">
                    <button type="button" @click="closeModal"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-stone-900 rounded-lg w-8 h-8 ms-auto inline-flex justify-center items-center">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                    </button>
                </div>

                <!-- 内容 -->
                <div class="px-6 pt-2 space-y-6">
                    <div class="grid grid-cols-6 gap-6">
                        <div class="col-span-6 sm:col-span-3">
                            <label for="name" class="block mb-2 text-sm font-medium text-stone-900">
                                食品名
                            </label>
                            <input v-model="formData.name" type="text" name="name" id="name"
                                class="shadow-xs bg-gray-50 border border-gray-300 text-stone-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                placeholder="例） たまご" required>
                        </div>
                        <div class="col-span-6 sm:col-span-3">
                            <label for="expiry_date" class="block mb-2 text-sm font-medium text-stone-900">
                                期限
                            </label>
                            <input v-model="formData.expiry_date" type="date" name="expiry_date" id="expiry_date"
                                class="shadow-xs bg-gray-50 border border-gray-300 text-stone-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                style="appearance: none;" required>
                        </div>
                        <div class="col-span-6 sm:col-span-3">
                            <label for="purchase_date" class="block mb-2 text-sm font-medium text-stone-900">
                                購入日
                            </label>
                            <input v-model="formData.purchase_date" type="date" name="purchase_date" id="purchase_date"
                                class="shadow-xs bg-gray-50 border border-gray-300 text-stone-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                style="appearance: none;">
                        </div>
                        <div class="col-span-6 sm:col-span-3">
                            <label for="note" class="block mb-2 text-sm font-medium text-stone-900">
                                メモ
                            </label>
                            <textarea v-model="formData.note" name="note" id="note" rows="4"
                                class="shadow-xs bg-gray-50 border border-gray-300 text-stone-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"></textarea>
                        </div>
                    </div>
                </div>

                <!-- フッター -->
                <div class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-50"
                    :style="isPWA ? { paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' } : {}">
                    <button type="submit"
                        class="w-full text-white bg-primary font-medium rounded-lg text-sm py-3 text-center">
                        追加
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { supabase } from "../supabase";
import { usePWAStore } from '@/stores/pwa'

const pwaStore = usePWAStore()
const isPWA = pwaStore.isPWA
const { isCreateModalOpen, formData } = defineProps({
    isCreateModalOpen: Boolean,
    formData: Object,
});

const emit = defineEmits(['close', 'save-food']);

// モーダルを閉じる
const closeModal = () => {
    emit('close');
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
            emit('save-food');
        }
    } catch (err) {
        console.error('予期しないエラー:', err);
    }
};
</script>

<style scoped></style>