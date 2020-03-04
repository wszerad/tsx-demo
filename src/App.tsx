import { defineComponent, ref } from "vue";

export const App = defineComponent({
    setup() {
        const list = ref([1,2,3,4,5]);
        const val = ref('string');
        function event() {
            console.log('test');
        }

        return () => (
            <div>
                Shop:
                <input type="text" v-model={val} />
                {val.value}
                <ul>
                    {
                        list.value.map(i => (
                            <li>
                                <a onClick={event}>
                                    {i}
                                </a>
                            </li>
                        ))
                    }
                </ul>
            </div>
        )
    }
});