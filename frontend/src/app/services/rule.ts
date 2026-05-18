import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rule } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RuleService {
  private apiUrl = `${environment.apiUrl}/rules`;

  constructor(private http: HttpClient) {}

  getRules(): Observable<Rule[]> {
    return this.http.get<Rule[]>(this.apiUrl);
  }

  getRuleById(id: number): Observable<Rule> {
    return this.http.get<Rule>(`${this.apiUrl}/${id}`);
  }

  addRule(rule: Omit<Rule, 'id'>): Observable<Rule> {
    return this.http.post<Rule>(this.apiUrl, rule);
  }

  updateRule(id: number, rule: Omit<Rule, 'id'>): Observable<Rule> {
    return this.http.put<Rule>(`${this.apiUrl}/${id}`, rule);
  }

  deleteRule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
