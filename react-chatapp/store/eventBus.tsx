import  { Callback }  from "@/types/chat";

class EventBus {
    private listeners: { [key: string]: Callback[] } = {};

    subscribe(event: string, callback: Callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    unsubscribe(event: string, callback: Callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    publish(event: string, data?: any) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => callback(data));
    }
}

const eventBus = new EventBus();
export default eventBus;