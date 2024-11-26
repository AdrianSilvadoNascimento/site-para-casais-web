import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { CommentsOnCouplePhotoModel } from '../models/comments-on-couple-photo-model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentsOnCouplePhotoService {
  private readonly apiUrl: string = `${environment.apiUrl}/comments-couple-photo`

  private commentsData = new BehaviorSubject<CommentsOnCouplePhotoModel[]>([new CommentsOnCouplePhotoModel()])
  $commentsData = this.commentsData.asObservable()

  constructor(private http: HttpClient) {}

  updateCommentsData(commentsData: CommentsOnCouplePhotoModel[]): void {
    this.setCommentsCache(commentsData)
    this.commentsData.next(commentsData)
  }

  createComment(comment: CommentsOnCouplePhotoModel, userId: string): Observable<CommentsOnCouplePhotoModel[]> {
    const storedComments = localStorage.getItem('comments')

    return this.http.post<CommentsOnCouplePhotoModel[]>(
      `${this.apiUrl}/create-comment-on-couple-photo/${userId}`,
      comment
    ).pipe(tap((res: any) => {
      if (storedComments) {
        const comments = JSON.parse(storedComments)
        comments.push(res)
        this.updateCommentsData(comments)
      } else {
        this.updateCommentsData(res as CommentsOnCouplePhotoModel[])
      }
    }))
  }

  getComments(userId: string): Observable<CommentsOnCouplePhotoModel[]> {
    return this.http.get<CommentsOnCouplePhotoModel[]>(
      `${this.apiUrl}/get-comments-on-couple-photo/${userId}`
    ).pipe(tap(res => {
      this.updateCommentsData(res)
    }))
  }

  setCommentsCache(comments: CommentsOnCouplePhotoModel[]): void {
    localStorage.setItem('comments', JSON.stringify(comments))
  }
}
