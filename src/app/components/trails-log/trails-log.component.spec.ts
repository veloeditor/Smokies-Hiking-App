import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailsLogComponent } from './trails-log.component';

describe('TrailsLogComponent', () => {
  let component: TrailsLogComponent;
  let fixture: ComponentFixture<TrailsLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailsLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailsLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
