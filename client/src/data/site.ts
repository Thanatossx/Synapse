/** İçerik ve medya URL'leri — Durable şemasından türetildi */

export const SITE = {
  name: "SYNAX",
  email: "ahmetefeozturk010@gmail.com",
  orgDescription:
    "SYNAX is an immersive underground rave platform based in Amsterdam. Dark aesthetic, purple and black palette.",
} as const;

export const NAV = [
  { to: "/", label: "Anasayfa" },
  { to: "/events", label: "Etkinlikler" },
  { to: "/tickets", label: "Bilet ve Kurallar" },
  { to: "/bracelet", label: "Bileklik Kültürü" },
] as const;

export const FOOTER_NAV = [
  { to: "/", label: "Anasayfa" },
  { to: "/events", label: "Etkinlikler" },
  { to: "/tickets", label: "Biletler" },
  { to: "/about", label: "Hakkımızda" },
] as const;

export const IMAGES = {
  brandLogo: "https://i.imgur.com/OYP8jUe.png",
  aboutClub:
    "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/infinite-images/ab4a84be-aafa-45f3-a469-632b0cdfdd6c-ZEt0aUv9dObV6RIwGcWbXy9oqMsjhM.png",
  aboutVinyl:
    "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/infinite-images/0da0ab13-84ee-4f78-9ef6-79b42e82dc2e-1sKWMTJwBN7fOaKGfjDj6X7RElGMjg.png",
} as const;

export const EVENT_CAROUSEL = [
  {
    title: "FREQUENCY404",
    description: "Sinyal kayıp. Gerçeklik bulunamadı.",
    image:
      "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/SYNAPSE2-uFSvwHlnlYjl8pfdxwURClyTb1Qo67.png",
  },
  {
    title: "XXX?",
    description: "YAKINDA.",
    image:
      "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/synapse3-1SER7inZRxEcRCRvRybKRcO4tKtOFS.png",
  },
  {
    title: "???",
    description: "YAKINDA.",
    image:
      "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/SYNAPSE4-g0vnE3qsctrnIv8pBBI5yXbdv4qEp1.png",
  },
  {
    title: "???",
    description: "YAKINDA.",
    image:
      "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/SYNAPSE1-91oTScrRJJNkuJOUzUBmrby9biro2C.png",
  },
  {
    title: "???",
    description: "YAKINDA.",
    image:
      "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/SYNAPSE5-AAFo4Fe9ojRitjBLmOv2hEMUisnzfl.png",
  },
] as const;

export const TEAM = [
  {
    name: "ucsekizalti",
    role: "Founder and Creative Director",
    description:
      "Visionary behind Synax's dark aesthetic and immersive event concept.",
    image:
      "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/generated-content/headshots/fbef264d-9c28-43f0-920b-c2570811b147.png",
  },
  {
    name: "Sophie Verlaan",
    role: "Events and Operations Manager",
    description:
      "Manages logistics and execution of SYNAX events across Amsterdam venues.",
    image:
      "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/generated-content/headshots/955ca6ca-f417-46f5-b5d6-46ecd8046b80.png",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Working with SYNAX brought our underground music community closer together.",
    name: "Alex van der Berg",
    title: "Founder, Amsterdam Underground Collective",
    image:
      "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/generated-content/headshots/9e5a7de4-3619-4bc4-92ca-91444a928fc6.png",
  },
  {
    quote:
      "SYNAX understands what makes the Amsterdam electronic music scene special.",
    name: "Marina Kowalski",
    title: "Venue Manager, North Holland Music Space",
    image:
      "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/generated-content/headshots/bf38fbc-634d-4928-ade1-310987db6268.png",
  },
  {
    quote:
      "Their approach to promoting local talent while maintaining artistic integrity is exactly what our network needed.",
    name: "Jonas Petersen",
    title: "DJ & Label Owner, Synthetic Sounds",
    image:
      "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/generated-content/headshots/fbef264d-9c28-43f0-920b-c2570811b147.png",
  },
  {
    quote:
      "Synax's focus on creating immersive experiences matches our mission.",
    name: "Sophie Mercier",
    title: "Creative Director, Amsterdam Visuals Collective",
    image:
      "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/generated-content/headshots/c8880a8b-f588-48a3-abd7-31964200eb25.png",
  },
] as const;

export const FAQ_EN = [
  {
    q: "What kind of events does SYNAX host?",
    a: "SYNAX creates immersive underground rave experiences in Amsterdam with curated lineups and a full sensory experience.",
  },
  {
    q: "How do I buy tickets?",
    a: "Visit the /tickets page to browse upcoming events and secure your spot.",
  },
  {
    q: "Where does SYNAX host its events?",
    a: "Amsterdam underground venues — see /events for locations.",
  },
] as const;

export const TICKET_RULES_FAQ = [
  {
    q: "İlk olarak, hoşgörü.",
    a: "Kalabalığın içinden geçerken 'pardon' ve 'teşekkür ederim' demeyi unutmayın, ne kadar bir kaos içerisinde olsak bile kibar olmakta fayda var.",
  },
  {
    q: "Yardımlaşma",
    a: "Etrafınızdaki insanlara dikkat edin. Oturan veya sersemlemiş görünen birini fark ederseniz, iyi olup olmadığını sorun.",
  },
  {
    q: "Asla çok fazla uyuşturucu veya alkol kullanmayın.",
    a:
      "İster inanın ister inanmayın, rave partilerinde çok fazla sarhoş olmadan da doyasıya eğlenebilirsiniz ve yaygın inanışın aksine, rave partileri sadece uyuşturucu ve alkolden ibaret değildir. Elbette bunlar kültürün bir parçası olabilir, ancak istemediğiniz zaman kendinizi içki içmeye ve kafayı bulmaya zorlamanıza gerek yok. Kibarca 'hayır' diyebilirsiniz, biliyorsunuz.\n\n" +
      "Bunun dışında, asla kaldırabileceğinizden fazla alkol veya uyuşturucu tüketmemelisiniz. Unutmayın ki rave partileri biter ve bir şekilde eve gitmeniz gerekir, bu da yolculuk yapmayı ve diğer insanlarla birlikte yolculuk etmeyi gerektirir. Bu insanlar - şoförler, aynı arabadaki arkadaşlarınız veya toplu taşıma araçlarındaki yolcular - sizin kadar sarhoş ve uyuşturucu etkisinde olmayabilirler, ancak sizin gibi sarhoş ve uyuşturucu etkisinde olan birinin yanında bulunmaktan rahatsız olabilirler. Onları bu utanç verici durumdan kurtarın.",
  },
  {
    q: "Telefonunuzu bir kenara bırakın.",
    a:
      "Rave partilerinde telefon ekranınızdan çok daha parlak, ışıltılı ve eğlenceli şeyler var. Lazer ışıkları, ışıklı çubuklar ve LED eldivenler her yerde. Disko topları (evet, hala moda) tam önünüzde. Gerçekten de anın tadını çıkarmak yerine selfie ve video çekmekle meşgul olmanız çok yazık.\n\n" +
      "Rave partileri, sürükleyici bir deneyimdir. Eğer rave partilerine gitmenizin tek sebebi Facebrowser'da paylaşmaya değer fotoğraflar çekmekse, belki de rave partileri size göre değildir.",
  },
  {
    q: "Kendinizi ifade etmek için giyinin.",
    a:
      "Rave ve festival kültürü sadece müzikle ilgili değil. İstediğiniz her şeyi giyebilirsiniz. Rave, kendiniz olabileceğiniz tek yer. Ancak çok fazla seçenek var, bu yüzden bazen ne giyeceğinize karar vermek zor olabiliyor.\n\n" +
      "Ancak, diğer rave katılımcıları PLUR (Barış, Sevgi, Birlik, Saygı) ilkelerini uyguladığı için endişelenmenize gerek yok. Ne giyerseniz giyin, herkes size karşı arkadaş canlısı ve anlayışlı olacaktır.",
  },
  {
    q: "P.L.U.R",
    a:
      "Son olarak, PLUR'u öğrenin ve yaşatın: Peace, Love, Unity, Respect — yani barış, sevgi, birlik ve hem kendinize hem başkalarına saygı ve sorumluluk.",
  },
] as const;

export const BRACELET_ITEMS = [
  {
    title: "SYNAX - Black Kandi Bracelet",
    description:
      "Organizatörler veya sahneye yakın VIP'ler. Ortamı yöneten lead raverler.",
    image:
      "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/tcIpKCE-VLezQH7wzgmVYIW7kSsXzzSsb7kEF2.png",
  },
  {
    title: "SYNAX - Red Kandi Bracelet",
    description:
      "İlişki aramayanlar, yalnız takılmak isteyenler için sınır belirten bileklik.",
    image:
      "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/M45nIT6-nM358VI29Cao6nve0lDjlQimiLQcVK.png",
  },
  {
    title: "SYNAX - Blue Kandi Bracelet",
    description:
      "Sadece cinsel açıdan etkileşim arayanlar için görsel iletişim rengi.",
    image:
      "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/LwBebdY-IVBWAPbqikW8o9rYbBOeRCBetLutBJ.png",
  },
  {
    title: "SYNAX - Green Kandi Bracelet",
    description:
      "İlişki arayan, PLUR ruhunu benimseyen ve pozitif enerji yayan kişiler.",
    image:
      "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/4QGakqA-u3gFcf0me8WEJY4FgmccvCbG2Dgukk.png",
  },
  {
    title: "SYNAX - Rainbow Kandi Bracelet",
    description: "Açık fikirli, her türlü enerjiyi ve çeşitliliği kucaklayanlar.",
    image:
      "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/Untitled%20%283%29-81v2qKX1fdasnJlnsfWLlEDcDwWn6h.png",
  },
  {
    title: "SYNAX - Yellow Kandi Bracelet",
    description:
      "İlk kez rave deneyimi yaşayanlar veya yeni katılımcılar için destek rengi.",
    image:
      "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/Untitled%20%284%29-n5daAsQ2my9ZeQQCTJtI7M6zvdkM9h.png",
  },
] as const;
