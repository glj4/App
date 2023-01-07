import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoHousePage } from './info-house.page';

describe('InfoHousePage', () => {
  let component: InfoHousePage;
  let fixture: ComponentFixture<InfoHousePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoHousePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoHousePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
