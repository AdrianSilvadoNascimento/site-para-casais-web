import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';

@Component({
  selector: 'app-affection-message',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './affection-message.component.html',
  styleUrl: './affection-message.component.scss'
})
export class AffectionMessageComponent implements OnInit {
  currentUser!: UserModel
  currentUserId!: string
  daysCount!: number
  currentTime: Date = new Date()

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    localStorage.setItem('isLoggedIn', 'false')
    this.activatedRoute.params.subscribe(param => {
      this.currentUserId = param['id']
    })

    if (this.currentUserId.length) {
      this.userService.getUser(this.currentUserId).subscribe(res => {
        this.currentUser = res;
        this.calculateDays();
      })
    }

    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser)
      this.calculateDays();
    }

    this.updateCurrentTime();
    setInterval(() => {
      this.updateCurrentTime();
    }, 1000);
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
}
