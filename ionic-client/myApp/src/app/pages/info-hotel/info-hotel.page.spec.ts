import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoHotelPage } from './info-hotel.page';

describe('InfoHotelPage', () => {
  let component: InfoHotelPage;
  let fixture: ComponentFixture<InfoHotelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoHotelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoHotelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
