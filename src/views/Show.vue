<template>
    <div class="container">
        <div v-if="loading" class="h-10 w-full">
            <ContentLoader />
        </div>
        <div class="w-full lg:w-1/2" v-else>
            <div class="border rounded-lg overflow-hidden">
                <div class="border-b bg-gray-50 p-4">
                    {{ transaction.name }}
                </div>
                <div class="p-4">
                    <div class="mb-4">
                        <label class="text-gray-500 uppercase tracking-wider font-semibold text-xs">Amount</label>
                        <div class="leading-relaxed text-gray-500">
                            Rp {{ transaction.amount }}
                        </div>
                    </div>
                </div>
                <div class="p-4">
                    <div class="mb-4">
                        <label class="text-gray-500 uppercase tracking-wider font-semibold text-xs">Store</label>
                        <div class="leading-relaxed text-gray-500">
                            Rp {{ transaction.when }}
                        </div>
                    </div>
                </div>
                 <div class="p-4">
                    <div class="mb-4">
                        <label class="text-gray-500 uppercase tracking-wider font-semibold text-xs">Description</label>
                        <div class="leading-relaxed text-gray-500">
                            Rp {{ transaction.description }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import router from '@/router'
import { ContentLoader } from 'vue-content-loader'

export default {
    components: { ContentLoader },

    setup() {
        const route = useRoute()
        let slug = route.params.slug

        const loading = ref(false)

        const transaction = ref([]) // null atau empty array

        const getTransaction = async () => {
            loading.value = true
            try {
                let { data } = await axios.get(`api/cash/${slug}`)
                transaction.value = data.data  
                loading.value = false              
            } catch (e) {
                console.log(e)
                router.replace('/cash')
                loading.value = false
            }
        }

        onMounted(() => {
            getTransaction()
        })

        return {
            transaction, loading
        }
    }
}
</script>