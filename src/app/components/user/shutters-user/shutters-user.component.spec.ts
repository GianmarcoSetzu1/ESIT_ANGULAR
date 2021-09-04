import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShuttersUserComponent } from './shutters-user.component';

describe('ShuttersUserComponent', () => {
  let component: ShuttersUserComponent;
  let fixture: ComponentFixture<ShuttersUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShuttersUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShuttersUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
