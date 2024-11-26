import { DatePipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as faRegularHeart, faComment, faPaperPlane, faUser } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { CommentsOnCouplePhotoService } from '../../services/comments-on-couple-photo.service';
import { CommentsOnCouplePhotoModel } from '../../models/comments-on-couple-photo-model';

@Component({
  selector: 'app-affection-message',
  standalone: true,
  imports: [
    DatePipe,
    NgFor,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './affection-message.component.html',
  styleUrl: './affection-message.component.scss'
})
export class AffectionMessageComponent implements OnInit {
  currentUser!: UserModel
  currentUserId!: string
  daysCount!: number
  currentTime: Date = new Date()
  faHeart = faSolidHeart
  faRegularHeart = faRegularHeart
  faComment = faComment
  sendMessage = faPaperPlane
  faUser = faUser
  isLiked: boolean = false

  drawMessage: boolean = false
  commentForm: FormGroup = new FormGroup({})
  comments: CommentsOnCouplePhotoModel[] = []

  constructor(
    private userService: UserService,
    private commentsService: CommentsOnCouplePhotoService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.createForm(new CommentsOnCouplePhotoModel)

    localStorage.setItem('isLoggedIn', 'false')
    this.activatedRoute.params.subscribe(param => {
      this.currentUserId = param['id']
    })

    if (this.currentUserId.length) {
      this.userService.getUser(this.currentUserId).subscribe(res => {
        this.currentUser = res;
        this.isLiked = res.photo_liked
        this.calculateDays();
      })
    }

    const storedLike = localStorage.getItem('photo_liked')
    if (storedLike) {
      this.isLiked = JSON.parse(storedLike)
    }

    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser)
      this.calculateDays();
    }

    this.getComments();
    const storedComments = localStorage.getItem('comments')
    if (storedComments) {
      this.comments = JSON.parse(storedComments)
    }

    this.updateCurrentTime();
    setInterval(() => {
      this.updateCurrentTime();
    }, 1000);
  }

  like(): void {
    this.isLiked = !this.isLiked
    this.userService.likePhoto(this.isLiked, this.currentUserId).subscribe(() => {
      localStorage.setItem('photo_liked', JSON.stringify(this.isLiked))
    }, (err: any) => {
      console.error(err)
      alert('Failed to like photo')
      this.isLiked = JSON.parse(localStorage.getItem('photo_liked')!!)
    })
  }

  getComments(): void {
    this.commentsService.getComments(this.currentUserId).subscribe(res => {
      this.comments = res
    })
  }

  updateCurrentTime(): void {
    this.currentTime = new Date();
  }

  calculateDays(): void {
    const coupleStartDate = new Date(this.currentUser.couple_start);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - coupleStartDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    this.daysCount = daysDifference
  }

  createForm(comment: CommentsOnCouplePhotoModel): void {
    this.commentForm = this.formBuilder.group({
      message: [comment.message],
    });
  }

  onSubmitComment(): void {
    if (this.commentForm.value === '') return

    this.commentsService.createComment(this.commentForm.value, this.currentUserId).subscribe(() => {
      this.commentForm.reset();
      this.drawMessage = !this.drawMessage
      this.getComments();
    }, (err: any) => {
      console.error(err);
      this.commentForm.reset();
      alert('Failed to create comment');
    });
  }
}
