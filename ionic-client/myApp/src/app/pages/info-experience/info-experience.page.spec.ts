import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoExperiencePage } from './info-experience.page';

describe('InfoExperiencePage', () => {
  let component: InfoExperiencePage;
  let fixture: ComponentFixture<InfoExperiencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoExperiencePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoExperiencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
