export interface Trail {
   id: number;
   name: string;
   length: number;
   sections: [
       sectionName: string,
       sectionLength: number
   ];
}
