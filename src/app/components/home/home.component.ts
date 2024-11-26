import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Dialog, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
import {
  faHeart as faRegularHeart,
  faPenToSquare,
} from '@fortawesome/free-regular-svg-icons';
import {
  faHeart as faSolidHeart,
  faQrcode,
} from '@fortawesome/free-solid-svg-icons';

import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    FontAwesomeModule,
    DialogModule,
    DatePipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly qrCodeApiUrl: string = `${environment.qrCodeApiUrl}${environment.domain}`;
  currentUser!: UserModel;
  currentUserId: string = '';
  qrCode!: string;
  daysCount!: number;
  currentTime: Date = new Date();

  dialog = inject(Dialog);

  faQrCode = faQrcode;
  editPen = faPenToSquare;
  faLikedHeart = faSolidHeart;
  faHeart = faRegularHeart;
  isLiked!: boolean;

  updateCurrentTime(): void {
    this.currentTime = new Date();
  }

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.currentUserId = localStorage.getItem('user_id')?.toString()!!;

    this.userService.$userData.subscribe((res) => {
      this.currentUser = res;
    });

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }

    console.log(this.currentUser);
    this.isLiked = this.currentUser.photo_liked;
    const storedLiked = localStorage.getItem('photo_liked');
    if (storedLiked) {
      this.isLiked = JSON.parse(storedLiked);
    }

    this.calculateDays();
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
    this.daysCount = daysDifference;
  }

  gerarQrCode(): void {
    this.qrCode = `${this.qrCodeApiUrl}/${this.currentUserId}`;
  }

  openDialog() {
    this.gerarQrCode()

    this.dialog.open(CdkDialogDataExampleDialog, {
      minWidth: '300px',
      data: {
        qrCode: this.qrCode,
      },
    });
  }
}

@Component({
  selector: 'qrcode-modal',
  templateUrl: 'modal-qrcode.component.html',
  styleUrl: 'modal-qrcode.component.scss',
})
export class CdkDialogDataExampleDialog {
  data = inject(DIALOG_DATA);
}
