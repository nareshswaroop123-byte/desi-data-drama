window.DDD_TOUR={
levels:{
outside:{name:"Outside",asset:"front",description:"Datta Enterprises, its neighbouring shops, entry and exit lanes, and rear loading yard.",rooms:["entrance","eastlane","westlane","yard"],up:"ground"},
ground:{name:"Ground floor",asset:"ground",description:"Reception, operations, pantry, stock and utility rooms. The main stair core is on the west side.",rooms:["juhi","gopal","mangal","bunty","dulari"],up:"first",down:"outside"},
first:{name:"First floor",asset:"first",description:"Naresh's investigation room, Danish's sales room, Dev's accounts and Datta Bhaiya's cabin.",rooms:["naresh","danish","dev","datta"],up:"second",down:"ground"},
second:{name:"Second floor",asset:"second",description:"HR, IT, MIS, data entry, training and the open terrace. Iron stairs on the terrace lead to the upper roof.",rooms:["archana","chip","mis","meeting","terrace"],up:"roof",down:"first"},
roof:{name:"Upper roof",asset:"roof",description:"Hanuman ji's platform faces south. Return by the iron stairs to the second-floor terrace.",rooms:["hanuman"],down:"second"}
},
rooms:{
entrance:{name:"Front entrance / Raghubir",level:"outside",people:["person-1"],bounds:[47,65,23,25],point:[62,77],note:"Raghubir is stationed outside the entrance. Reception is just inside."},
eastlane:{name:"East entry lane",level:"outside",asset:"front-east",bounds:[68,37,20,57],point:[77,72],note:"The east lane is the entry route towards the rear loading yard."},
westlane:{name:"West exit lane",level:"outside",asset:"front-west",bounds:[0,36,22,57],point:[4,75],note:"The west lane is the exit route. Ramu Photocopy and Chhotu Chai are near the frontage."},
yard:{name:"Rear loading yard",level:"outside",asset:"rear",bounds:[5,14,89,77],point:[50,60],note:"Goods receiving, the tempo and parking sit behind the building. The goods door connects to Bunty's stock area.",people:["person-5"]},
juhi:{name:"Juhi / Reception",level:"ground",people:["person-2"],bounds:[49,56,39,24],point:[69,65],note:"Reception, Juhi's desk and the visitor waiting area."},
gopal:{name:"Gopal Garg / Operations",level:"ground",people:["person-6"],bounds:[49,38,39,18],point:[69,46],note:"Operations desk beside the central corridor."},
mangal:{name:"Mangal / Pantry",level:"ground",people:["person-3"],bounds:[12,38,27,17],point:[25,47],note:"Pantry and tea table. Mangal also moves around the office."},
bunty:{name:"Bunty / Stock and dispatch",level:"ground",people:["person-5"],bounds:[12,7,50,30],point:[36,25],note:"Receiving, packing and dispatch, with the north goods door to the yard."},
dulari:{name:"Dulari Aunty / Utility",level:"ground",people:["person-4"],bounds:[68,23,20,14],point:[79,30],note:"Utility and housekeeping area behind the operations room."},
naresh:{name:"Naresh / Investigation",level:"first",people:["person-15"],bounds:[10,7,32,47],point:[27,30],note:"Naresh's investigation workspace occupies the west side of the first floor."},
danish:{name:"Danish / Sales",level:"first",people:["person-12"],bounds:[53,21,37,17],point:[72,28],note:"Sales and operations room on the east side."},
dev:{name:"Dev / Accounts",level:"first",people:["person-13"],bounds:[53,39,37,17],point:[72,46],note:"Accounts and finance, between Danish's room and the MD cabin."},
datta:{name:"Datta Bhaiya / MD cabin",level:"first",people:["person-14"],bounds:[53,57,37,32],point:[71,75],note:"Datta Bhaiya's cabin faces the front of the building."},
archana:{name:"Archana Madam / HR",level:"second",people:["person-11"],bounds:[10,29,29,23],point:[25,41],note:"HR and administration on the west side, above the stair landing."},
chip:{name:"Chirag 'Chip' / IT",level:"second",people:["person-9"],bounds:[10,8,29,20],point:[25,18],note:"IT support and systems bench in the northwest room."},
mis:{name:"Pammi, Tippu and Bholu / MIS",level:"second",people:["person-10","person-7","person-8"],bounds:[40,29,49,23],point:[66,39],note:"Three separate desks for Pramod's MIS reports, Tippu's data entry and Bholu's trainee work."},
meeting:{name:"Meeting / Training",level:"second",bounds:[40,8,33,20],point:[57,18],note:"Shared meeting and training room beside IT."},
terrace:{name:"Open terrace / Roof stairs",level:"second",bounds:[49,53,39,34],point:[67,70],note:"Chairs, tea table and plants. The iron stairs on the east side continue up to Hanuman ji's platform."},
hanuman:{name:"Hanuman ji / Upper roof",level:"roof",bounds:[23,35,53,22],point:[49,44],note:"The upper-roof Hanuman ji platform faces south, above the open terrace."}
},
views:[["front","Front"],["front-east","Front / east"],["east","East side"],["rear","Rear yard"],["front-west","Front / west"]]
};
