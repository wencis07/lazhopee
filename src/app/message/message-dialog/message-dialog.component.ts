import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent {

  @Input() product: any = null;
  @Output() close = new EventEmitter<void>();

  messageContent = '';
  sent = false;

  constructor(private messageService: MessageService) {}

  sendMessage(): void {
    if (!this.messageContent.trim()) return;
    this.messageService.sendMessage({
      receiver: this.product.owner._id,
      productId: this.product._id,
      productName: this.product.name,
      content: this.messageContent
    }).subscribe(() => {
      this.sent = true;
      this.messageContent = '';
      setTimeout(() => this.close.emit(), 1500);
    });
  }

  closeDialog(): void {
    this.close.emit();
  }
}