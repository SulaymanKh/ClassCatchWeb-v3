import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-booking-tutor',
  templateUrl: './booking-tutor.component.html',
  styleUrl: './booking-tutor.component.scss'
})
export class BookingTutorComponent {
  loading = false;
  filters = {
    subject: '',
    rating: '',
    name: '',
    location: '',
    availability: ''
  };

  subjects = ['Math', 'Science', 'English'];
  ratings = ['1', '2', '3', '4', '5'];
  availabilities = ['Morning', 'Afternoon', 'Evening'];

  tutors = [
    {
      name: 'John Doe',
      subject: 'Math',
      rating: '5',
      about: 'Experienced Math tutor',
      image: './assets/img/faces/ayo-ogunseinde-2.jpg'
    },
    {
      name: 'John Doe',
      subject: 'Math',
      rating: '4',
      about: 'Experienced Math tutor',
      image: './assets/img/faces/ayo-ogunseinde-2.jpg'
    },
    {
      name: 'John Doe',
      subject: 'Math',
      rating: '3',
      about: 'Experienced Math tutor',
      image: './assets/img/faces/ayo-ogunseinde-2.jpg'
    },
    {
      name: 'John Doe',
      subject: 'Math',
      rating: '2',
      about: 'Experienced Math tutor',
      image: './assets/img/faces/ayo-ogunseinde-2.jpg'
    },
    // more tutors
  ];

  isMobile = false;
  showMobileFilter = false;
  deviceInfo = null;

  constructor(private deviceService: DeviceDetectorService) {
    this.checkDevice();
  }

  checkDevice() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
  }

  applyFilters() {
    this.showMobileFilter = false;
    // Apply your filter logic here
  }

  toggleMobileFilter() {
    this.showMobileFilter = !this.showMobileFilter;
  }
}
