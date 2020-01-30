import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionsViewComponent } from './sections-view.component';

describe('SectionsViewComponent', () => {
  let component: SectionsViewComponent;
  let fixture: ComponentFixture<SectionsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
