import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Rule, Category } from '../../models/models';
import { RuleService } from '../../services/rule';
import { CategoryService } from '../../services/category';

@Component({
  selector: 'app-rules',
  imports: [FormsModule],
  templateUrl: './rules.html',
  styleUrl: './rules.css',
})
export class Rules implements OnInit {
  rules = signal<Rule[]>([]);
  categories = signal<Category[]>([]);

  newRule = { name: '', merchant: '', categoryId: null as number | null };

  constructor(
    private ruleService: RuleService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.ruleService.getRules().subscribe({
      next: data => this.rules.set(data),
      error: err => console.error('Failed to load rules:', err)
    });
    this.categoryService.getCategories().subscribe({
      next: data => this.categories.set(data),
      error: err => console.error('Failed to load categories:', err)
    });
  }

  addRule(): void {
    if (!this.newRule.name.trim() || !this.newRule.merchant.trim()) return;

    this.ruleService.addRule({
      name: this.newRule.name.trim(),
      merchant: this.newRule.merchant.trim(),
      categoryId: this.newRule.categoryId,
      category: null
    }).subscribe({
      next: rule => {
        this.rules.update(rules => [...rules, rule]);
        this.newRule = { name: '', merchant: '', categoryId: null };
      },
      error: err => console.error('Failed to add rule:', err)
    });
  }

  deleteRule(id: number): void {
    this.ruleService.deleteRule(id).subscribe({
      next: () => this.rules.update(rules => rules.filter(r => r.id !== id)),
      error: err => console.error('Failed to delete rule:', err)
    });
  }
}
