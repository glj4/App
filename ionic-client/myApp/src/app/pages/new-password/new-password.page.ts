import { Component, ContentChild, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonInput } from '@ionic/angular';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {

  @ContentChild(IonInput) input: IonInput;

  orderForm: FormGroup;
  isNewPassword = false;
  passwordType1: string = 'password';
  passwordIcon1: string = 'eye-off-outline';
  passwordType2: string = 'password';
  passwordIcon2: string = 'eye-off-outline';

  constructor(
    private route: Router,
    private userSvc: UsersService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],   
    },
    {'validator': this.isMatching});
  }

  isMatching(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('repeatPassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  newPassword(){
    this.isNewPassword = true;
    if (this.orderForm.valid) {
      this.userSvc.newPassword(this.orderForm.value)
      .subscribe(() => {
        this.route.navigate(['/login']);
        this.clearForm();
      });
    }
  }

  hideShowPassword1() {
    this.passwordType1 = this.passwordType1 === 'text' ? 'password' : 'text';
    this.passwordIcon1 = this.passwordIcon1 === 'eye-off-outline' ? 'eye-outline' : 'eye-off-outline';
  }

  hideShowPassword2() {
    this.passwordType2 = this.passwordType2 === 'text' ? 'password' : 'text';
    this.passwordIcon2 = this.passwordIcon2 === 'eye-off-outline' ? 'eye-outline' : 'eye-off-outline';
  }

  get errorControl() {
    return this.orderForm.controls;
  }

  public clearForm() {
    this.isNewPassword = false;
    this.orderForm.reset();
  }
}
