import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingChatbot } from './floating-chatbot';

describe('FloatingChatbot', () => {
  let component: FloatingChatbot;
  let fixture: ComponentFixture<FloatingChatbot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingChatbot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingChatbot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
