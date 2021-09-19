Vue.component('chronometer', {
    template:
    `
    <section class="d-flex flex-column align-items-center">
        <h1 class="mt-4">{{title}}</h1>
        <h1><p> <span class = "px-2">{{format(minutes)}}</span> : <span class = "px-2">{{format(seconds)}}</span> : <span class = "px-2">{{format(tenths)}}</span></p></h1>
        <div class="d-flex flex-column flex-sm-row justify-content-center w-50">
            <button class="mb-1 px-4 py-2 mx-1 bg-success text-light border-0 rounded-pill" @click="onStart">Play</button>
            <button class="mb-1 px-4 py-2 mx-1 bg-warning text-dark border-0 rounded-pill" @click="onPause">Pause</button>
            <button class="mb-1 px-4 py-2 mx-1 bg-danger text-white border-0 rounded-pill" @click="onStop">Stop</button>
            <button v-if ="historyAvailable" class="px-4 py-2 mx-1 text-dark border-0 rounded-pill" @click="onClear">Clear</button>
        </div>
        <div class="d-flex flex-column align-items-center vw-100">
            <h1>History</h1>
            <p v-for="hour in list">{{hour}}</p>
        </div>
    </section>
    `,
    data() {
        return {
            title: "Chronometer with VueJS",
            minutes: 0,
            seconds: 0,
            tenths: 0,
            running: false,
            chronometer_id: undefined,
            list: [],
            id: 1,
            TIME_KEY: "time",
            historyAvailable: false,
        }
    },

    mounted() {
        this.loadHistory()
    },

    methods: {
        onStart() {
            if(this.running === false) {
                this.running = true
                this.chronometer_id = setInterval(this.updateCounters, 10)
            }
        },
        
        onPause() {
            if(this.running === true) {
                this.running = false
                clearInterval(this.chronometer_id)
            }
        },
        
        onStop() {
            if (this.running === true) {
                this.running = false;
                clearInterval(this.chronometer_id)
                this.chronometer_id = undefined
            }
            this.updateHistory(this.tenths, this.seconds, this.minutes)
            this.resetCounters()
            this.historyAvailable = true
        },

        onClear() {
            this.list = []
            localStorage.clear()
            this.historyAvailable = false
        },

        format(number) {
            let string = ''
            if(number < 10) {
                string = "0" + number
            } else {
                string = number.toString()
            }
        
            return string
        },

        updateCounters() {
            this.tenths++
            if (this.tenths == 100) {
                this.seconds++
                this.tenths = 0
            }
        
            if(this.seconds == 60) {
                this.minutes++
                this.seconds = 0
            }
        
            if(this.minutes == 60) {
                this.minutes = 0
            }
        },

        resetCounters() {
            this.minutes = 0
            this.seconds = 0
            this.tenths = 0
        },

        updateHistory(tenths, seconds, minutes) {
            if(tenths === 0 && seconds === 0 && minutes === 0)
            {
                return
            }
        
            let lastHour = `${this.format(minutes)}:${this.format(seconds)}:${this.format(tenths)}`
            this.list.push(lastHour)
            localStorage.setItem(this.TIME_KEY, JSON.stringify(this.list))
        },

        loadHistory() {
            this.list = JSON.parse(
                localStorage.getItem(this.TIME_KEY) || '[]'
            )

            if(this.list.length > 0)
            {
                this.historyAvailable = true
            }
        },
    }
})

new Vue({
    el: ".main"
})