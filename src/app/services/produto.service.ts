import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto.model';

@Injectable()
export class ProdutoService {
  apiURL = `http://localhost:3000/produtos`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiURL);
  }

  create(data: Produto): Observable<any> {
    return this.http.post<void>(this.apiURL, data);
  }
}
