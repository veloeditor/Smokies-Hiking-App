export interface UserHike {
    id: number;
    trailName: string;
    totalMiles: number;
    date: Date;
    comments: string;
    sections: [{
        sectionName: string;
        sectionLength: number;
      }];
    roundTrip: boolean;
    roundTripMiles: number;
    photoUrl: string;
  }
