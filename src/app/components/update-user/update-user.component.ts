import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user.model';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss',
})
export class UpdateUserComponent {
  updateForm: FormGroup = new FormGroup({});
  imagePreview: string | null = null;
  imageBase64: string | null = null;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm(new UserModel());

    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.populateForm(JSON.parse(currentUser));
    }
  }

  createForm(user: UserModel): void {
    this.updateForm = this.formBuilder.group({
      spouse_name: [user.spouse_name, Validators.required],
      couple_start: [user.couple_start, Validators.required],
      couple_image: [user.couple_image, Validators.required],
      affection_message: [user.affection_message, Validators.required],
    });
  }

  populateForm(user: UserModel) {
    this.updateForm.setValue({
      spouse_name: user.spouse_name,
      couple_start: user.couple_start,
      couple_image: '',
      affection_message: user.affection_message,
    });
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem válido.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      const base64Reader = new FileReader();
      base64Reader.onload = () => {
        const base64String = base64Reader.result as string;

        const base64Data = base64String.split(',')[1];
        this.imageBase64 = base64Data;

        this.updateForm.patchValue({ couple_image: this.imageBase64 });
        this.updateForm.get('couple_image')?.updateValueAndValidity();
      };

      base64Reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    const updateData: UserModel = this.updateForm.value
    updateData.couple_image = this.imageBase64 || '';

    if (this.imageBase64 === null || this.imageBase64 === '') {
      delete updateData.couple_image
    }

    this.userService.updateUser(updateData).subscribe(
      () => {
        alert('Registro realizado com sucesso!');
        this.router.navigate(['/inicio']);
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
