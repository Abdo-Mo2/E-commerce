import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Maintainence } from './maintainence';

describe('Maintainence', () => {
  let component: Maintainence;
  let fixture: ComponentFixture<Maintainence>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Maintainence]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Maintainence);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
