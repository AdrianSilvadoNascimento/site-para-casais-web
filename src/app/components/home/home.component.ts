import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    DatePipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly qrCodeApiUrl: string = `${environment.qrCodeApiUrl}${environment.domain}`
  currentUser!: UserModel
  currentUserId: string = ''
  qrCode!: string
  daysCount!: number
  currentTime: Date = new Date()

  updateCurrentTime(): void {
    this.currentTime = new Date();
  }

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.currentUserId = localStorage.getItem('user_id')?.toString()!!

    this.userService.$userData.subscribe(res => {
      this.currentUser = res;
    });

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }

    this.calculateDays()
    this.updateCurrentTime();
    setInterval(() => {
      this.updateCurrentTime();
    }, 1000);

    if (!this.currentUser.spouse_name?.length) {
      this.router.navigate(['/registrar-informacoes-pessoa']);
    }
  }

  calculateDays(): void {
    const coupleStartDate = new Date(this.currentUser.couple_start);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - coupleStartDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    this.daysCount = daysDifference
  }

  gerarQrCode(): void {
    this.qrCode = `${this.qrCodeApiUrl}/${this.currentUserId}`
  }
}
