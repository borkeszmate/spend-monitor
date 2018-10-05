import { Injectable } from '@angular/core';
import { Spend } from '../interfaces/spend';
@Injectable({
  providedIn: 'root'
})
export class PostsServiceService {

  constructor() { }
  Spends:Spend[]= [];


}
