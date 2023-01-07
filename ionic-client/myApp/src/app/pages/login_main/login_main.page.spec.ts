import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { LoginMainPage } from './login_main.page';

describe('LoginMainPage', () => {
  let component: LoginMainPage;
  let fixture: ComponentFixture<LoginMainPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginMainPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
