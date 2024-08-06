import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Blog } from './types/blog';


@Injectable({
  providedIn: 'root'
})
export class BlogService {

  BASE_URL:string='http://localhost:5203/';
  errorMessage:string='';
  constructor(private httpClient:HttpClient) { }




  getAllBlog(){
    return this.httpClient.get(this.BASE_URL+'api/blog/getAllBlogs');
  }

  getBlogById(id:number) {
   return this.httpClient.get(this.BASE_URL+'api/blog/getBlogById/'+id);
  }

  createBlog(payload:Blog){
    return this.httpClient.post(this.BASE_URL+'api/blog/createBlog',payload);
  }

  updateBlog(id:number,payload:Blog){
    return this.httpClient.put(this.BASE_URL+'api/blog/updateBlog/'+id,payload);
  }

  deleteBlog(id:number){
    return this.httpClient.delete(this.BASE_URL+'api/blog/deleteBlog/'+id);
  }

  

}
