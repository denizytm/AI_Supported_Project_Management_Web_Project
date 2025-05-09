export interface NotificationType {
    id  : number,
    title : string,
    message : string,
    createdAt : string,
    isRead : boolean,
    link : string,
    senderName ?: string
}