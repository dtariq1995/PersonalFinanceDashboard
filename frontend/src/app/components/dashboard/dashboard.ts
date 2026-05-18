import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, signal, effect } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { Transaction } from '../../models/models';
import { TransactionService } from '../../services/transaction';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('incomeExpenseChart') incomeExpenseChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('spendingTrendChart') spendingTrendChartRef!: ElementRef<HTMLCanvasElement>;

  totalIncome = signal(0);
  totalExpenses = signal(0);
  netSavings = signal(0);
  uncategorizedCount = signal(0);
  recentTransactions = signal<Transaction[]>([]);

  private categoryChart?: Chart;
  private incomeExpenseChart?: Chart;
  private spendingTrendChart?: Chart;
  private viewReady = false;
  private pendingData: Transaction[] | null = null;

  constructor(
    private transactionService: TransactionService,
    private themeService: ThemeService
  ) {
    effect(() => {
      const dark = this.themeService.darkMode();
      if (this.viewReady && this.pendingData) {
        this.renderCharts(this.pendingData, dark);
      }
    });
  }

  ngOnInit(): void {
    this.transactionService.getTransactions().subscribe({
      next: data => {
        this.computeSummaries(data);
        this.pendingData = data;
        if (this.viewReady) this.renderCharts(data, this.themeService.darkMode());
      },
      error: err => console.error('Failed to load transactions:', err)
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.pendingData) this.renderCharts(this.pendingData, this.themeService.darkMode());
  }

  ngOnDestroy(): void {
    this.categoryChart?.destroy();
    this.incomeExpenseChart?.destroy();
    this.spendingTrendChart?.destroy();
  }

  private computeSummaries(transactions: Transaction[]): void {
    const income = transactions
      .filter(t => t.category?.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.category?.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    this.totalIncome.set(income);
    this.totalExpenses.set(expenses);
    this.netSavings.set(income - expenses);
    this.uncategorizedCount.set(transactions.filter(t => !t.category).length);

    const sorted = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    this.recentTransactions.set(sorted.slice(0, 5));
  }

  private renderCharts(transactions: Transaction[], dark: boolean): void {
    this.renderCategoryChart(transactions, dark);
    this.renderIncomeExpenseChart(transactions, dark);
    this.renderSpendingTrendChart(transactions, dark);
  }

  private chartColors(dark: boolean) {
    return {
      text:  dark ? '#94a3b8' : '#6b7280',
      grid:  dark ? '#334155' : '#e5e7eb',
      border: dark ? '#1e293b' : '#fff',
    };
  }

  private renderCategoryChart(transactions: Transaction[], dark: boolean): void {
    const { text, border } = this.chartColors(dark);
    const expenseMap = new Map<string, number>();
    for (const t of transactions) {
      if (t.category?.type === 'Expense') {
        const name = t.category.name;
        expenseMap.set(name, (expenseMap.get(name) ?? 0) + t.amount);
      }
    }

    const labels = [...expenseMap.keys()];
    const data = [...expenseMap.values()];
    const colors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

    this.categoryChart?.destroy();
    this.categoryChart = new Chart(this.categoryChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 2,
          borderColor: border,
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: true,
        color: text,
        plugins: {
          legend: { position: 'right', labels: { color: text } },
          tooltip: {
            callbacks: { label: ctx => ` $${(ctx.raw as number).toFixed(2)}` }
          }
        }
      }
    });
  }

  private renderIncomeExpenseChart(transactions: Transaction[], dark: boolean): void {
    const { text, grid } = this.chartColors(dark);
    const income = transactions
      .filter(t => t.category?.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.category?.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    this.incomeExpenseChart?.destroy();
    this.incomeExpenseChart = new Chart(this.incomeExpenseChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
          data: [income, expenses],
          backgroundColor: ['#16a34a', '#dc2626'],
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        color: text,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: text }, grid: { color: grid } },
          y: {
            beginAtZero: true,
            ticks: { color: text, callback: v => '$' + v },
            grid: { color: grid }
          }
        }
      }
    });
  }

  private renderSpendingTrendChart(transactions: Transaction[], dark: boolean): void {
    const { text, grid } = this.chartColors(dark);
    const dailyMap = new Map<string, { income: number; expenses: number }>();

    for (const t of transactions) {
      const day = t.date.substring(0, 10);
      if (!dailyMap.has(day)) dailyMap.set(day, { income: 0, expenses: 0 });
      const entry = dailyMap.get(day)!;
      if (t.category?.type === 'Income') entry.income += t.amount;
      else if (t.category?.type === 'Expense') entry.expenses += t.amount;
    }

    const sortedDays = [...dailyMap.keys()].sort();
    const labels = sortedDays.map(d => { const [, m, day] = d.split('-'); return `${m}/${day}`; });

    this.spendingTrendChart?.destroy();
    this.spendingTrendChart = new Chart(this.spendingTrendChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Income',
            data: sortedDays.map(d => dailyMap.get(d)!.income),
            backgroundColor: '#16a34a',
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: 'Expenses',
            data: sortedDays.map(d => dailyMap.get(d)!.expenses),
            backgroundColor: '#dc2626',
            borderRadius: 4,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        color: text,
        plugins: { legend: { position: 'top', labels: { color: text } } },
        scales: {
          x: { ticks: { color: text }, grid: { color: grid } },
          y: {
            beginAtZero: true,
            ticks: { color: text, callback: v => '$' + v },
            grid: { color: grid }
          }
        }
      }
    });
  }
}
