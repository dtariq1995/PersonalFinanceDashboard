import { Component, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Transaction } from '../../models/models';
import { TransactionService } from '../../services/transaction';

@Component({
  selector: 'app-transactions',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions implements OnInit {

  constructor(private transactionService: TransactionService) {}
  transactions = signal<Transaction[]>([]);

  ngOnInit(): void {
    this.transactionService.getTransactions().subscribe({
      next: data => this.transactions.set(data),
      error: err => console.error('Failed to load transactions:', err)
    });
  }
}
