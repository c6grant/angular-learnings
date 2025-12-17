// import { NgIf } from '@angular/common';
// import {
//   afterNextRender,
//   Component,
//   DestroyRef,
//   inject,
//   viewChild,
// } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { debounceTime } from 'rxjs/internal/operators/debounceTime';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css',
//   imports: [FormsModule, NgIf],
// })
// export class LoginComponent {
//   constructor() {
//     afterNextRender(() => {
//       const savedForm = window.localStorage.getItem('email');

//       if (savedForm) {
//         const loadedForm = JSON.parse(savedForm);
//         const savedEmail = loadedForm.email;
//         setTimeout(() => {
//           this.form().setValue({ email: savedEmail, password: '' });
//         }, 1);
//       }

//       const subscription = this.form()
//         .valueChanges?.pipe(debounceTime(500))
//         .subscribe({
//           next: (value) => {
//             window.localStorage.setItem(
//               'email',
//               JSON.stringify({ email: value.email })
//             );
//             console.log(value.email);
//           },
//         });
//       this.destroyRef.onDestroy(() => {
//         subscription?.unsubscribe();
//       });
//     });
//   }

//   private destroyRef = inject(DestroyRef);
//   private form = viewChild.required<NgForm>('loginForm');

//   onSubmit(formData: NgForm) {
//     if (formData.form.invalid) {
//       return;
//     }

//     const enteredEmail = formData.form.value.email;
//     const enteredPassword = formData.form.value.password;

//     console.log('Form submitted!', formData);
//     console.log('Email:', enteredEmail);
//     console.log('Password:', enteredPassword);
//   }
// }

import { NgIf } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule, NgIf],
})
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  get emailIsInvalid() {
    return (
      this.form.invalid &&
      (this.form.controls.email.touched || this.form.controls.password.touched)
    );
  }

  ngOnInit(): void {
    const savedForm = window.localStorage.getItem('email');

    if (savedForm) {
      const loadedForm = JSON.parse(savedForm);
      this.form.patchValue({ email: loadedForm.email });
    }
    const subscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem(
            'email',
            JSON.stringify({ email: value.email })
          );
          console.log(value.email);
        },
      });
    this.destroyRef.onDestroy(() => {
      subscription?.unsubscribe();
    });
  }

  onSubmit() {
    console.log('Form submitted!', this.form.value);
    const email = this.form.value.email;
    const password = this.form.value.password;
    console.log('Email:', email);
    console.log('Password :', password);
  }
}
