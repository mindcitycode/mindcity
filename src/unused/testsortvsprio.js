import { MinQueue } from "heapify/heapify.mjs";
const w = 1920
const h = 1080
const tiles = (w / 16) * (h / 16)
const count = tiles * 10 + 200
console.log('count', count)



setInterval(() => {

    const times0 = []
    const times1 = []


    const T0 = performance.now()

    for (let z = 0; z < 100; z++) {

        const datas = []
        for (let i = 0; i < count; i++) {

            const l = 'a'.charCodeAt(0) + Math.floor(Math.random() * 26)
            const prio = l * 10
            const dataIndex = datas.length
            const data = [{ string: String.fromCharCode(l), index: dataIndex, prio }]
            datas.push(data)
        }
        //console.log(i,'push',{data,dataIndex,prio})

        {
            const t0 = performance.now()
            const queue = new MinQueue(count);
            for (let i = 0; i < count; i++) {
                const data = datas[i]
                queue.push(i, data.prio)
            }
            const datas2 = []
            for (let i = 0, l = datas.length; i < l; i++) {
                const dataIndex = queue.pop()
                const data = datas[dataIndex]
                //console.log('->',dataIndex,data)
                datas2.push(data)
            }
            const t1 = performance.now()

            times0.push(t1 - t0)
        }
        {
            const t0 = performance.now()
            datas.sort((a, b) => {
                return a.prio - b.prio
            })
            const t1 = performance.now()
            times1.push(t1 - t0)

        }

        //  console.log("?", queue.pop(), datas2)

        //////////////////////////////




    }

    const T1 = performance.now()
    console.log('took', T1 - T0)
    console.log({ times0 })
    console.log({ times1 })
    const mean = times => times.reduce((t, r) => r + t / times.length, 0)
    console.log('mean0', mean(times0))
    console.log('mean1', mean(times1))

}, 10000)

/*
queue.push(1, 10);
queue.push(2, 5);
console.log(queue.pop());  // 2
queue.peek();  // 1
queue.clear();
queue.pop();  // undefined
*/