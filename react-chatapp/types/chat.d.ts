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
    reasoningContent?: string
}

export interface MessageRequestBody {
    messages: Message[]
    model: string
    temperature: number
    max_tokens: number
}

export type Callback = (data?: any) => void;