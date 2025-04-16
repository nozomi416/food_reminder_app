<template>
    <div>
        <button @click="startScanner" class="mt-20 mb-4 px-4 py-2 bg-blue-600 text-white rounded">
            バーコード読み取り
        </button>

        <div id="scanner" class="w-full max-w-md border"></div>

        <p v-if="result" class="mt-4">読み取ったコード: {{ result }}</p>
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import Quagga from 'quagga'

const result = ref('')

const startScanner = () => {
    result.value = ''

    Quagga.init({
        inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: document.querySelector('#scanner'),
            constraints: {
                width: 640,
                height: 480,
                facingMode: 'environment', // 背面カメラ
            },
        },
        decoder: {
            readers: ['ean_reader'],
        },
        locate: true,
    }, err => {
        if (err) {
            console.error('Quagga init error:', err)
            return
        }
        Quagga.start()
    })

    Quagga.onDetected(data => {
        if (data && data.codeResult && data.codeResult.code) {
            result.value = data.codeResult.code
            console.log('読み取り結果:', result.value)
            Quagga.stop()
        }
    })
}

onBeforeUnmount(() => {
    Quagga.stop()
})
</script>