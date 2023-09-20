import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneImageComponent } from './zone-image.component';

describe('ZoneImageComponent', () => {
  let component: ZoneImageComponent;
  let fixture: ComponentFixture<ZoneImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZoneImageComponent]
    });
    fixture = TestBed.createComponent(ZoneImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
