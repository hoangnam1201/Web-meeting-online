import { Message } from "../models/message.model";
import { User } from "../models/user.model";
import { UserReadDto } from "./user-read.dto";

export class MessageReadDto {
  _id: any;
  sender: UserReadDto;
  message: string;
  files: { fileId: string; name: string }[];
  like: [{ option: number }];
  createdAt: Date;

  static fromMessage(message: Message): MessageReadDto {
    const messageRead = new MessageReadDto();
    messageRead._id = message._id;
    messageRead.sender = UserReadDto.fromUser(message.sender as User);
    messageRead.message = message.message;
    messageRead.like = message.like;
    messageRead.files = message.files;
    messageRead.createdAt = message.createdAt;
    return messageRead;
  }

  static fromArray(messages: Message[]): MessageReadDto[] {
    return messages.map((messages) => this.fromMessage(messages));
  }
}
