import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Transactions } from './components/transactions/transactions';
import { Rules } from './components/rules/rules';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard},
  { path: 'transactions', component: Transactions},
  { path: 'rules', component: Rules }
];
