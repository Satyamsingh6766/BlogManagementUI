import { Component, Input, Output, } from "@angular/core";
import { Blog } from "../types/blog";
import { BlogService } from "../blog.service";
import { Subject } from "rxjs";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-blog",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./blog.component.html",
  styleUrl: "./blog.component.css",
})
export class BlogComponent {
  @Input() blogData!: Blog;
  @Output() refreshList = new Subject();

  isUpdate: boolean = false;

  constructor(private blogService: BlogService) { }

  onDelete() {
    this.blogService.deleteBlog(this.blogData.id).subscribe(
      (response: any) => {
        this.isUpdate = false;
        this.refreshList.next(0);
      },
      (error) => {
        this.blogService.errorMessage = error.error.message;
      }
    );

  }


  onUpdate() {
    const data = {
      ...this.blogData,
    };
    this.blogService.updateBlog(this.blogData.id, data).subscribe((response: any) => {
      this.refreshList.next(0);
    }, (error) => {
      this.blogService.errorMessage = error.error.message;
    });
  }
  openEditModal() {
    this.isUpdate = true;
  }
  updateText(event: any) {
    this.blogData.text = event.target.value;
  }
}
