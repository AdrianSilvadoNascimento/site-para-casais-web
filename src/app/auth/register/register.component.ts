import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { RegisterUserModel } from '../../models/register-user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup({});

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.formBuilder.group({
      name: ['', Validators.required],
      age: [null, Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.createForm(new RegisterUserModel());
  }

  createForm(registerModel: RegisterUserModel): void {
    this.registerForm = this.formBuilder.group({
      name: [registerModel.name, Validators.required],
      age: [registerModel.age, Validators.required],
      email: [
        registerModel.email,
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        ],
      ],
      password: [registerModel.password, Validators.required],
    });
  }

  onSubmit(): void {
    this.userService.registerUser(this.registerForm.value).subscribe(() => {
      alert(
        'Parabéns! Você acaba de registrar.'
      );
    }, (err) => {
      alert(err.error.message);
    }
  );
  }
}
