export interface UserHike {
    trailName: string;
    totalMiles: number;
    date: Date;
    comments: string;
    sections: [{
        sectionName: string;
        sectionLength: number;
      }];
  }
