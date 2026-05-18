import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rule } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class RuleService {
  private apiUrl = 'http://localhost:5265/api/rules';   // Base url for rules api endpoints

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
