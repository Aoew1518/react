export interface Chat {
    id: string
    title: string
    updateTime: number
}

export interface Message {
    role: "user" | "assistant"
    content: string
    id?: string
    chatId: string
}

export interface MessageRequestBody {
    messages: Message[]
    model: string
}

export type Callback = (data?: any) => void;