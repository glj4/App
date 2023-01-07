import { Component, ContentChild, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInput } from '@ionic/angular';
import { Photo } from '../../models/photo.interface';
import { PhotoService } from '../../services/photo.service';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscriber } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  orderForm: FormGroup;
  email: string;
  password: string;
  name: string;
  photos: Photo[] = [];
  areTherePhotos = false;
  isSignup = false;
  passwordType1: string = 'password';
  passwordIcon1: string = 'eye-off-outline';
  passwordType2: string = 'password';
  passwordIcon2: string = 'eye-off-outline';
  myImage!: Observable<any>;
  base64code!: any;

  @ContentChild(IonInput) input: IonInput;

  constructor(
    public route:Router,
    private photoSvc: PhotoService,
    public userSvc: UsersService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: [''],
      phone: ['', [Validators.pattern('^[0-9]+$'), Validators.minLength(9), Validators.maxLength(9)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      image: ['']
    },
    {'validator': this.isMatching});
  }

  isMatching(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('repeatPassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  signUp(){
    this.isSignup = true;
    if (this.orderForm.valid) {
      this.userSvc.register(this.orderForm.value)
      .subscribe(() => {
        this.route.navigate(['/login']);
        this.clearForm();
      }, (error) => {
        console.log(error);
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

  public newPhoto(): void {
    this.photoSvc.addNewToGallery(this.orderForm.value.email);
  }

  public buttonShowPhotos(): boolean {
    if (this.photos.length > 0) {
      this.areTherePhotos = true;
    }
    else {
      this.areTherePhotos = false;
    }
    return this.areTherePhotos;
  }

  public changePhoto(): void {
    this.photos.splice(0);
    this.photoSvc.addNewToGallery(this.orderForm.value.email);
  }

  public getPhotos(): Photo[] {
    this.photos = this.photoSvc.getPhotos();
    return this.photos;
  }

  public clearForm() {
    this.isSignup = false;
    this.photos = this.photoSvc.deletePhotos();
    this.areTherePhotos = false;
    this.orderForm.reset();
  }

  public clearBooleans() {
    this.isSignup = false;
  }
}
