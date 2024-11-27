import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'header',
  standalone: true,
  imports: [FontAwesomeModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false

  exitIcon = faArrowRightFromBracket

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.$isLoggedIn.subscribe(res => {
      this.isLoggedIn = res
    })

    const storedIsLoggedIn = localStorage.getItem('isLoggedIn')
    if (storedIsLoggedIn) {
      this.isLoggedIn = true
    }
  }

  checkout(): void {
    this.userService.checkout()
    this.isLoggedIn = false
  }
}
