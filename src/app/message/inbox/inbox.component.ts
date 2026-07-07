import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

  conversations: any[] = [];
  selectedConversation: any = null;
  thread: any[] = [];
  replyContent = '';
  currentUserId = '';

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = localStorage.getItem('userId') || '';
    this.loadConversations();
  }

  loadConversations(): void {
    this.messageService.getConversations().subscribe(data => {
      // Group by product + other user
      const grouped: any = {};
      data.forEach((msg: any) => {
        const otherId = msg.sender._id === this.currentUserId ? msg.receiver._id : msg.sender._id;
        const key = `${otherId}_${msg.product}`;
        if (!grouped[key]) {
          grouped[key] = {
            otherUser: msg.sender._id === this.currentUserId ? msg.receiver : msg.sender,
            productId: msg.product,
            productName: msg.productName,
            lastMessage: msg.content,
            isRead: msg.isRead,
            senderId: msg.sender._id
          };
        }
      });
      this.conversations = Object.values(grouped);
    });
  }

  openThread(conv: any): void {
    this.selectedConversation = conv;
    this.messageService.getThread(conv.otherUser._id, conv.productId).subscribe(data => {
      this.thread = data;
    });
    this.messageService.markAsRead(conv.otherUser._id).subscribe();
  }

  sendReply(): void {
    if (!this.replyContent.trim()) return;
    this.messageService.sendMessage({
      receiver: this.selectedConversation.otherUser._id,
      productId: this.selectedConversation.productId,
      productName: this.selectedConversation.productName,
      content: this.replyContent
    }).subscribe(() => {
      this.replyContent = '';
      this.openThread(this.selectedConversation);
    });
  }

  goBack(): void {
    this.selectedConversation = null;
    this.thread = [];
  }
}