<template>
    <div>
        <div class="h-screen">
            <video ref="videoRef" class="w-full h-1/2 object-cover" autoplay muted playsinline></video>

            <p class="mt-3 mx-6 pb-2 text-center font-medium border-b border-gray-300">バーコードを写してください</p>

            <div class="mt-5 px-6 grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-3">
                    <label for="name" class="block mb-2 font-medium text-stone-900">食品名</label>
                    <input v-model="foodName" type="text" name="name" id="name" readonly
                        class="shadow-xs bg-gray-50 border border-gray-300 text-stone-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5">
                </div>
            </div>

            <!-- <p v-if="jancode" class="mt-4">読み取ったコード: {{ jancode }}</p>
            <div v-if="product" class="mt-4">
                <h2 class="text-xl font-bold">{{ product.itemName }}</h2>
                <p>メーカー: {{ product.brandName }}</p>
                <img :src="product.images[0]" alt="商品画像" class="mt-2 w-48" v-if="product.images.length > 0" />
            </div> -->

            <p v-if="errorMsg" class="text-red-500 mt-4 px-6">{{ errorMsg }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { BrowserMultiFormatReader } from '@zxing/browser'
import axios from 'axios'

const videoRef = ref(null)
const jancode = ref('')
const product = ref(null)
const foodName = ref('');
const errorMsg = ref('')
const codeReader = new BrowserMultiFormatReader()
const apiKey = import.meta.env.VITE_JANCODE_API_KEY;

let controls = null;

const startScanner = async () => {
    jancode.value = ''

    try {
        // カメラデバイスの取得
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')

        if (videoDevices.length === 0) {
            alert('カメラが見つかりません')
            return
        }

        const selectedDeviceId = videoDevices[0].deviceId

        // カメラからの映像をvideoタグに表示
        controls = codeReader.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.value,
            (res, err, ctrl) => {
                controls = ctrl;

                if (res) {
                    jancode.value = res.getText()
                    console.log('jancode:', jancode.value)
                    searchProduct()
                }
                if (err) {
                    console.error(err)
                }
            }
        )
    } catch (e) {
        console.error('カメラ起動エラー:', e)
    }
}

const stopScanner = () => {
    if (videoRef.value && videoRef.value.srcObject) {
        const tracks = videoRef.value.srcObject.getTracks();
        tracks.forEach(track => track.stop());  // 各トラックを停止
    }
    if (controls) {
        controls.stop(); // デコード停止
    }
}

const searchProduct = async () => {
    errorMsg.value = ''
    product.value = null

    try {
        const url = `https://api.jancodelookup.com/?appId=${apiKey}&query=${jancode.value}&hits=1&page=1&type=code`

        const response = await axios.get(url)
        console.log(response)

        if (response.data.product.length > 0) {
            errorMsg.value = '';
            product.value = response.data.product[0]
            foodName.value = product.value.itemName || '';
        } else {
            errorMsg.value = '商品が見つかりませんでした。'
        }
    } catch (err) {
        console.error(err)
        errorMsg.value = 'エラーが発生しました。'
    }
}

onBeforeUnmount(() => {
    stopScanner();
});

defineExpose({ startScanner, stopScanner });
</script>