export interface Trail {
   id: number;
   name: string;
   length: number;
   trailhead: string;
   photoUrl: string;
   sections: [
       {
        sectionName: string,
        sectionLength: number
       }
   ];
}
