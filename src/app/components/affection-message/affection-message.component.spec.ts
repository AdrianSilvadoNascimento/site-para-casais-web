import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectionMessageComponent } from './affection-message.component';

describe('AffectionMessageComponent', () => {
  let component: AffectionMessageComponent;
  let fixture: ComponentFixture<AffectionMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffectionMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffectionMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
