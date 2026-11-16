export type Project = { id: string; title: string; category: 'game' | 'webapp'; description: string; icon: string; thumbnail?: string; color: string; tags: string[]; href: string | null; comingSoon?: boolean };
// 검증된 실제 서비스 URL만 href에 입력하세요. null이면 준비 중으로 표시됩니다.
export const projects: Project[] = [
 {id:'bungeoppang',thumbnail:'/images/thumbnails/bungeoppang.webp',title:'붕어빵 굽기',category:'game',description:'따끈따끈, 바삭바삭! 오늘은 내가 붕어빵 사장님.',icon:'🐟',color:'peach',tags:['캐주얼','요리'],href:'https://bungeoppang-seven.vercel.app'},
 {id:'pocha',thumbnail:'/images/thumbnails/pocha.webp',title:'향수병 포차',category:'game',description:'잠깐 쉬어가도 좋아. 정겨운 포차에서 만나는 작은 즐거움.',icon:'🍢',color:'pink',tags:['캐주얼','감성'],href:'https://pojangmacha-tawny.vercel.app'},
 {id:'kimjang',thumbnail:'/images/thumbnails/kimjang.webp',title:'포잎이의 김장 가게',category:'game',description:'순한 김치부터 매콤 김치까지! 주문대로 양념하고 김치통에 포장해 줘.',icon:'🥬',color:'mint',tags:['요리','타이밍'],href:'https://kimjang-five.vercel.app'},
 {id:'hotteok',thumbnail:'/images/thumbnails/hotteok.webp',title:'포잎이의 호떡 가게',category:'game',description:'손님 주문대로 꿀·씨앗 호떡을 굽고, 뒤집고 눌러 판매해 봐.',icon:'🥞',color:'peach',tags:['요리','타이밍'],href:'/hotteok'},
 {id:'goguma',thumbnail:'/images/thumbnails/goguma.webp',title:'포잎이의 군고구마 가게',category:'game',description:'서로 다르게 익는 고구마를 골라 꺼내 손님에게 따끈하게 건네줘.',icon:'🍠',color:'lavender',tags:['요리','타이밍'],href:'/goguma'},
 {id:'tree',thumbnail:'/images/thumbnails/tree.webp',title:'내 트리를 꾸며줘',category:'webapp',description:'마음을 담은 장식 하나. 우리만의 트리를 함께 꾸며봐요.',icon:'🎄',color:'mint',tags:['함께하기','꾸미기'],href:'https://decorate-my-tree.vercel.app/'},
 {id:'mom-nag',thumbnail:'/images/thumbnails/mom-nag.webp',title:'AI 엄마 잔소리',category:'webapp',description:'방 사진 올리면 엄마가 등짝 스매싱 지수를 매겨줘. 각오하고 들어와!',icon:'🧹',color:'peach',tags:['AI','웃음'],href:'https://mom-nag.vercel.app'},
 {id:'studybloom',title:'스터디블룸',category:'webapp',description:'차곡차곡 쌓은 집중이 꽃이 되는 곳. 나만의 공부 정원.',icon:'🌷',color:'lavender',tags:['공부','정원'],href:null,comingSoon:true},
];
