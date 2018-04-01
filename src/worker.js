import Recognizer from './recognizer'
import Speaker from './speaker'


function isRecognized(results) {
    if (!results || results.length === 0 || !results[0]) {
        return false
    }
    if (results.length === 1 && results[0] === 'а') {
        return false
    }
    return true
}


class Worker {
    constructor() {
        this.log = []
        this.recognizer = new Recognizer('ru-RU')
        this.speaker = new Speaker()

        this.working = false
    }

    async start() {
        if (this.working) {
            return
        }
        this.working = true
        this.work()
    }

    stop() {
        this.working = false
        this.recognizer.destroy()
    }

    async work() {
        if (!this.working) {
            return
        }

        const results = await this.recognizer.listen()
        if (isRecognized(results)) {
            await this.onRecognized(results)
        }

        this.work()
    }

    async onRecognized(results) {
        const recognized = results.join(' ')
        const response = recognized
        this.log.push({
            'user': recognized,
            'bot': response,
        })
        await this.speaker.speak(response)
    }
}

export default Worker
