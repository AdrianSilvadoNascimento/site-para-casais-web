import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.$userData.subscribe(res => {
      this.isLoggedIn = res.id !== ''
      localStorage.setItem('isLoggedIn', this.isLoggedIn.toString())
    })

    const storedIsLoggedIn = localStorage.getItem('isLoggedIn')
    if (storedIsLoggedIn) {
      this.isLoggedIn = JSON.parse(storedIsLoggedIn)
    }
  }

  checkout(): void {
    this.userService.checkout()
  }
}
