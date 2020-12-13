export interface Trail {
   id: number;
   name: string;
   length: number;
   trailhead: string;
   sections: [
       {
        sectionName: string,
        sectionLength: number
       }
   ];
}
