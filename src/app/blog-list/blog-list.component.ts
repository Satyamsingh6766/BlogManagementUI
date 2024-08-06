import { Component, ElementRef, EventEmitter, Output, ViewChild, } from "@angular/core";
import { BlogComponent } from "../blog/blog.component";
import { BlogService } from "../blog.service";
import { Blog } from "../types/blog";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: "app-blog-list",
  standalone: true,
  imports: [BlogComponent, CommonModule, ReactiveFormsModule],
  templateUrl: "./blog-list.component.html",
  styleUrl: "./blog-list.component.css",
})
export class BlogListComponent {
  blogList: Array<Blog> = [];
  blogForm: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    text: new FormControl('', [Validators.required, Validators.minLength(50)]),
  });
  errorMessage: string = '';
  paginatedBlogs: Array<Blog> = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;

  searchForm: FormGroup = new FormGroup({
    search: new FormControl(''),
  });

  constructor(private blogService: BlogService) {
    this.loadAllBlogs();
  }

  loadAllBlogs() {
    this.blogService.getAllBlog().subscribe((response: any) => {
      this.blogList = response.data;
      this.totalPages = Math.ceil(this.blogList.length / this.pageSize);
      this.updatePaginatedBlogs();
    });
  }
  updatePaginatedBlogs() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedBlogs = this.blogList.slice(startIndex, endIndex);
  }

  onRefreshList() {
    this.blogService.getAllBlog().subscribe((response: any) => {
      this.loadAllBlogs();
    });
  }

  onSubmit() {
    const currentDate = new Date();
    const data: Blog = {
      userName: this.blogForm.controls["userName"].value,
      text: this.blogForm.controls["text"].value,
      id: 0,
      dateCreated: currentDate.toISOString(),
    };
    this.blogService.createBlog(data).subscribe((response: any) => {
      this.loadAllBlogs();
      this.blogForm.reset();
    }, (error) => {
      this.blogService.errorMessage = error.error.message;
    });
  }

  onSearch() {
    {
      const searchValue = this.searchForm.controls['search'].value.toLowerCase();
      if(searchValue){
      this.blogList = this.blogList.filter((blog) =>
        blog.text?.toLowerCase().includes(searchValue)
      );
      this.totalPages = Math.ceil(this.blogList.length / this.pageSize);
      this.currentPage = 1;
      this.updatePaginatedBlogs();}else{
      this.onRefreshList();
      }
    }

  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedBlogs();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedBlogs();
    }
  }

}
