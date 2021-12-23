import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrailsListComponent } from './trails-list.component';

describe('HikesListComponent', () => {
  let component: TrailsListComponent;
  let fixture: ComponentFixture<TrailsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
