<template>
    <div class="container">
        <div class="flex">
            <div v-if="loading" class="h-10 w-full">
                <ContentLoader />
            </div>
            <div class="w-full lg:w-7/12 mr-6" v-else>
                <div class="w-full mb-8">
                    <div class="bg-gray-200 transform -rotate-1 rounded-2xl">
                        <div class="bg-gradient-to-br from-blue-500 to-light-blue-400 text-white p-6 transform rotate-1 rounded-2xl">
                            <label class="block uppercase text-xs text-blue-100 font-semibold tracking-wider mb-1">
                                Balances
                            </label>
                            <div class="text-3xl font-semibold">
                                Rp {{ state.balances }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center -mx-2">
                    <div class="w-full px-2">
                        <div class="bg-gray-200 transform -rotate-3 rounded-2xl">
                            <div class="bg-gradient-to-br from-teal-500 to-cyan-400 text-white p-6 transform rotate-3 rounded-2xl">
                                <label class="block uppercase text-xs text-teal-100 font-semibold tracking-wider mb-1">
                                    Debit
                                </label>
                                <div class="text-3xl font-semibold">
                                    Rp {{ state.debit }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-full px-2">
                        <div class="bg-gray-200 transform -rotate-3 rounded-2xl">
                            <div class="bg-gradient-to-br from-red-500 to-yellow-400 text-white p-6 transform rotate-3 rounded-2xl">
                                <label class="block uppercase text-xs text-red-100 font-semibold tracking-wider mb-1">
                                    Credit
                                </label>
                                <div class="text-3xl font-semibold">
                                    Rp {{ state.credit }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="my-10">
                    <div class="border rounded-lg overflow-hidden">
                        <div class="border-b px-6 py-4 bg-gray-50 flex items-center justify-between">
                            <div>
                                Transactions
                            </div>
                            <form class="flex items-center" @submit.prevent="getChases">
                                <input type="date" v-model="form.begin" class="bg-white rounded px-3 py-2 border">
                                <input type="date" v-model="form.to" class="bg-white rounded px-3 py-2 border mx-2">
                                <input type="submit" value="Search" class="px-3 py-2 rounded bg-gradient-to-br from-blue-500 to-light-blue-500 text-white focus:outline-none">
                            </form>
                        </div>
                        <!-- <div class="px-6 py-4"> -->
                        <div class="h-112 overflow-y-scroll">
                            <template v-for="transaction in state.transactions" :key="transaction.id">
                                <router-link :to="`/cashes/${transaction.slug}`" class="px-6 py-4 flex justify-between items-center hover:bg-gray-50 border-b">
                                    <span class="flex flex-col"> 
                                        <span class="text-gray-500 text-xs">{{ transaction.when }}</span>
                                        <span>{{ transaction.name }}</span>
                                    </span>
                                    <span :class="transaction.isCredit ? 'text-red-500' : 'text-green-500'">{{ transaction.amount }}</span>
                                </router-link>                        
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full lg:w-5/12">
                <h1 class="font-semibold text-lg text-gray-800 mb-4">
                    Add Transactions History
                </h1>
                <form @submit.prevent="add">
                    <div class="mb-5">
                        <label for="name" class="text-xs uppercase font-medium block mb-2">Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name" 
                            class="w-full border rounded-lg focus:outline-none focus:ring focus:border-blue-400 h-10 px-4 transition duration-150"
                            v-model="create.name"
                        >
                        <!-- <div class="text-red-500 mt-2 text-sm" v-if="errors['name']">{{ errors['name'][0] }}</div> -->
                    </div>
                    <div class="mb-5">
                        <label for="amount" class="text-xs uppercase font-medium block mb-2">Amount</label>
                        <input 
                            type="text" 
                            name="amount" 
                            id="amount" 
                            class="w-full border rounded-lg focus:outline-none focus:ring focus:border-blue-400 h-10 px-4 transition duration-150"
                            v-model="create.amount"
                        >
                        <!-- <div class="text-red-500 mt-2 text-sm" v-if="errors['amount']">{{ errors['amount'][0] }}</div> -->
                    </div>
                    <div class="mb-5">
                        <label for="when" class="text-xs uppercase font-medium block mb-2">When</label>
                        <input 
                            type="date" 
                            name="when" 
                            id="when" 
                            class="w-full border rounded-lg focus:outline-none focus:ring focus:border-blue-400 h-10 px-4 transition duration-150"
                            v-model="create.when"
                        >
                        <!-- <div class="text-red-500 mt-2 text-sm" v-if="errors['when']">{{ errors['when'][0] }}</div> -->
                    </div>
                    <div class="mb-5">
                        <label for="description" class="text-xs uppercase font-medium block mb-2">Description</label>
                        <textarea 
                            name="description" 
                            id="description" 
                            class="w-full border rounded-lg focus:outline-none focus:ring focus:border-blue-400 py-4 px-4 transition duration-150"
                            v-model="create.description"
                        >
                        </textarea>
                        <!-- <div class="text-red-500 mt-2 text-sm" v-if="errors['description']">{{ errors['description'][0] }}</div> -->
                    </div>
                    <button class="text-white px-4 h-10 rounded-lg focus:ring focus:ring-blue-300 bg-blue-500 hover:bg-blue-600">
                        Add Transaction
                    </button>
                </form>
            </div>
        </div>

    </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { ContentLoader } from 'vue-content-loader'

export default {
    components: { ContentLoader },

    setup() {
        const state = ref([])
        const form = reactive({
            begin: "",
            to: "",
        })

        const create = reactive({
            name: "",
            amount: "",
            when: "",
            description: "",
        })

        const loading = ref(false)

        const getChases = async() => {
            loading.value = true
            try {
                let {data} = await axios.get('api/cash', {
                    params: {
                        from: form.begin,
                        to: form.to
                    }
                })
                state.value = data
                form.begin = data.firstOfMonth
                form.to = data.now
                loading.value = false
            } catch (e) {
                console.log(e)
                loading.value = false
            }
        }

        const add = async() => {
            try {
                let {data} = await axios.post('api/cash/create', create )
                state.value.transactions.unshift(data.cash)
            } catch (e) {
                console.log(e)
            }
        }

        onMounted(() => {
            getChases()
        })

        return { state, loading, form, getChases, add, create }
    }
}
</script>

<style>

</style>