import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tutorFilter'
})
export class TutorFilterPipe implements PipeTransform {

  transform(tutors: any[], filters: any): any[] {
    if (!tutors || !filters) {
      return tutors;
    }

    return tutors.filter(tutor => {
      return (filters.subject ? tutor.subject === filters.subject : true)
        && (filters.rating ? tutor.rating === filters.rating : true)
        && (filters.name ? tutor.name.toLowerCase().includes(filters.name.toLowerCase()) : true);
    });
  }
}
