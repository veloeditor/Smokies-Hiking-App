export interface UserHike {
    id: number;
    trailName: string;
    totalMiles: number;
    date: Date;
    comments: string;
    imgUrl: string;
    sections: [{
        sectionName: string;
        sectionLength: number;
      }];
    roundTrip: boolean;
    roundTripMiles: number;
    photoUrl: string;
  }
