import {ChangeDetectorRef, Component, Input, OnChanges, Output, SimpleChanges, } from "@angular/core";
import { Blog } from "../types/blog";
import { BlogService } from "../blog.service";
import { Subject } from "rxjs";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
declare var bootstrap: any;
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

  editForm: FormGroup = new FormGroup({
    text: new FormControl(),
    userName: new FormControl()
  });
  constructor(private blogService: BlogService) { }

  openEditForm(userName: any): void {
    const modalData = document.getElementById(userName);
    if (modalData) {
      const modal = new bootstrap.Modal(modalData);
      modal.show();
      this.editForm.setValue({
        text: this.blogData.text,
        userName: this.blogData.userName
      });
    }
  }

  onDelete() {
    this.blogService.deleteBlog(this.blogData.id).subscribe(
      (response: any) => {
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
      ...this.editForm.value,
    };
    this.blogService.updateBlog(this.blogData.id, data).subscribe((response: any) => {
      this.refreshList.next(0);
    }, (error) => {
      this.blogService.errorMessage = error.error.message;
    });
  }

  updateText(event: any) {
    this.blogData.text = event.target.value;
  }


}
