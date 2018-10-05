import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendsFeedComponent } from './spends-feed.component';

describe('SpendsFeedComponent', () => {
  let component: SpendsFeedComponent;
  let fixture: ComponentFixture<SpendsFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpendsFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendsFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
