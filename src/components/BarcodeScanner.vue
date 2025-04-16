<template>
    <div>
        <button @click="startScanner" class="mb-4 px-4 py-20 bg-blue-600 text-white rounded">
            バーコード読み取り
        </button>

        <video ref="videoRef" class="w-full max-w-md border" autoplay muted playsinline></video>

        <p v-if="result" class="mt-4">読み取ったコード: {{ result }}</p>
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount, defineEmits } from 'vue'
import { BrowserMultiFormatReader  } from '@zxing/browser'

const emit = defineEmits(['scanned'])

const videoRef = ref(null)
const result = ref('')
const codeReader = new BrowserMultiFormatReader ()

const startScanner = async () => {
    result.value = ''

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
        codeReader.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.value,
            (res, err) => {
                if (res) {
                    result.value = res.getText()
                    console.log('result:', result.value)
                    codeReader.reset()
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

onBeforeUnmount(() => {
    codeReader.reset()
})
</script>