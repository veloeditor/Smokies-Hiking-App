import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HikesListComponent } from './hikes-list.component';

describe('HikesListComponent', () => {
  let component: HikesListComponent;
  let fixture: ComponentFixture<HikesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HikesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HikesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
