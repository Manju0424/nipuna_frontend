import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyNipuna } from './why-nipuna';

describe('WhyNipuna', () => {
  let component: WhyNipuna;
  let fixture: ComponentFixture<WhyNipuna>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyNipuna]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyNipuna);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
