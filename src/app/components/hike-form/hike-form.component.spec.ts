import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HikeFormComponent } from './hike-form.component';

describe('HikeFormComponent', () => {
  let component: HikeFormComponent;
  let fixture: ComponentFixture<HikeFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HikeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HikeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
